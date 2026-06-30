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
    const items: OrderItem[] = (apiOrder.items || []).map((item: any) => ({
      productId: item.product_id,
      name: item.product_name,
      sku: item.product_id,
      price: Number(item.unit_price),
      quantity: item.quantity,
      image: '',
    }));

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

    return {
      id: apiOrder.id,
      userId: '',
      items,
      subtotal: Number(apiOrder.total_amount) - (Number(apiOrder.total_amount) * 0.08),
      discount: 0,
      tax: Number(apiOrder.total_amount) * 0.08,
      shippingCost: 0,
      total: Number(apiOrder.total_amount),
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

    const mappedItems = orderInput.items.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
    }));

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
