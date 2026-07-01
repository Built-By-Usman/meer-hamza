import { Order, Address, OrderItem } from '../../types';
import { apiClient } from '../../lib/api-client';

export interface CreateOrderInput {
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  paymentMethod: string;
}

export interface IOrderRepository {
  createOrder(orderInput: CreateOrderInput): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
}

export class ApiOrderRepository implements IOrderRepository {
  private mapOrder(apiOrder: any): Order {
    const items: OrderItem[] = (apiOrder.items || []).map((item: any) => {
      const attributes: Record<string, string> = {};
      if (item.variant) {
        item.variant.split(', ').forEach((part: string) => {
          const [key, val] = part.split(': ');
          if (key && val) {
            attributes[key] = val;
          }
        });
      }
      return {
        productId: String(item.product_id),
        name: item.product_name,
        sku: String(item.product_id),
        price: Number(item.unit_price),
        quantity: item.quantity,
        image: item.product_image || '',
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined
      };
    });

    const [firstName = '', ...lastNameParts] = (apiOrder.shipping_address?.full_name || '').split(' ');
    const lastName = lastNameParts.join(' ');

    const address: Address = {
      firstName,
      lastName,
      addressLine1: apiOrder.shipping_address?.address_line1 || '',
      addressLine2: apiOrder.shipping_address?.address_line2 || '',
      city: apiOrder.shipping_address?.city || '',
      state: '',
      zipCode: apiOrder.shipping_address?.postal_code || '',
      country: apiOrder.shipping_address?.country || '',
      phone: apiOrder.shipping_address?.phone || '',
    };

    const totalAmount = Number(apiOrder.total_amount);
    const subtotalVal = Number(apiOrder.subtotal || totalAmount);
    const discountVal = Number(apiOrder.discount || 0);
    const shippingCostVal = Number(apiOrder.shipping_cost || 0);

    return {
      id: apiOrder.id,
      userId: '',
      items,
      subtotal: subtotalVal + discountVal,
      discount: discountVal,
      tax: 0,
      shippingCost: shippingCostVal,
      total: totalAmount,
      shippingAddress: address,
      billingAddress: address,
      shippingMethod: 'Express Shipping',
      paymentMethod: 'Credit Card',
      status: apiOrder.status.toLowerCase() as any,
      createdAt: apiOrder.created_at || new Date().toISOString(),
    };
  }

  async createOrder(orderInput: CreateOrderInput): Promise<Order> {
    const mappedAddress = {
      full_name: `${orderInput.shippingAddress.firstName} ${orderInput.shippingAddress.lastName}`.trim(),
      address_line1: orderInput.shippingAddress.addressLine1,
      address_line2: orderInput.shippingAddress.addressLine2 || '',
      city: orderInput.shippingAddress.city,
      province: orderInput.shippingAddress.state || '',
      postal_code: orderInput.shippingAddress.zipCode,
      country: orderInput.shippingAddress.country,
      phone: orderInput.shippingAddress.phone,
    };

    const mappedItems = orderInput.items.map(item => {
      let variantStr: string | null = null;
      if (item.attributes && Object.keys(item.attributes).length > 0) {
        variantStr = Object.entries(item.attributes)
          .map(([key, val]) => `${key}: ${val}`)
          .join(', ');
      }
      return {
        product_id: Number(item.productId),
        quantity: item.quantity,
        variant: variantStr
      };
    });

    const response = await apiClient.post<any>('/orders', {
      shipping_address: mappedAddress,
      items: mappedItems,
    });

    return this.mapOrder(response);
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await apiClient.get<any>(`/orders/${id}`);
      return this.mapOrder(response);
    } catch {
      return null;
    }
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const response = await apiClient.get<{ items: any[] }>('/orders');
      return response.items.map(item => this.mapOrder(item));
    } catch {
      return [];
    }
  }
}
