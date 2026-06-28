import { Order, Address, OrderItem } from '../../types';

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
