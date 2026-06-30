import { apiClient } from '../../lib/api-client';

export interface StoreSettings {
  id: number;
  delivery_charges: number;
  min_order_amount: number;
  store_name: string;
  store_slogan: string;
  is_sale_active: boolean;
  discount_percent: number;
  courier_name?: string;
  courier_acc_number?: string;
}

export interface ISettingsRepository {
  getSettings(): Promise<StoreSettings>;
}

export class ApiSettingsRepository implements ISettingsRepository {
  async getSettings(): Promise<StoreSettings> {
    const res = await apiClient.get<any>('/settings');
    return {
      id: res.id,
      delivery_charges: Number(res.delivery_charges || 0),
      min_order_amount: Number(res.min_order_amount || 0),
      store_name: res.store_name || 'TIMELESS BY MEER',
      store_slogan: res.store_slogan || '',
      is_sale_active: res.is_sale_active || false,
      discount_percent: Number(res.discount_percent || 0),
      courier_name: res.courier_name || '',
      courier_acc_number: res.courier_acc_number || '',
    };
  }
}
