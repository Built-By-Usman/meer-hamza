import { IOrderRepository, CreateOrderInput } from '../repositories/order';
import { Order } from '../../types';
import { ORDERS } from '../../data/db';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockOrders = [...ORDERS];

export class MockOrderRepository implements IOrderRepository {
  private latency = 500;

  async createOrder(orderInput: CreateOrderInput): Promise<Order> {
    await delay(this.latency);
    const newOrder: Order = {
      id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      ...orderInput,
      status: 'processing',
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
      createdAt: new Date().toISOString(),
    };

    mockOrders.unshift(newOrder);
    return newOrder;
  }

  async getOrderById(id: string): Promise<Order | null> {
    await delay(this.latency);
    const order = mockOrders.find((o) => o.id === id);
    return order ? { ...order } : null;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    await delay(this.latency);
    return mockOrders.filter((o) => o.userId === userId);
  }
}
