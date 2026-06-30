import { User } from '../../types';
import { apiClient } from '../../lib/api-client';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<LoginResponse>;
  register(email: string, password: string, fullName: string): Promise<LoginResponse>;
  getCurrentUser(token: string): Promise<User | null>;
  logout(): Promise<void>;
}

export class ApiAuthRepository implements IAuthRepository {
  private mapUser(item: any): User {
    const [firstName = '', ...lastNameParts] = (item.full_name || '').split(' ');
    const lastName = lastNameParts.join(' ');
    return {
      id: item.id,
      email: item.email,
      firstName,
      lastName,
      role: item.is_admin ? 'admin' : 'user',
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<any>('/auth/login', { email, password });
    return {
      token: 'cookie-auth-token',
      user: this.mapUser(response),
    };
  }

  async register(email: string, password: string, fullName: string): Promise<LoginResponse> {
    const response = await apiClient.post<any>('/auth/register', {
      email,
      password,
      full_name: fullName
    });
    return {
      token: 'cookie-auth-token',
      user: this.mapUser(response),
    };
  }

  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const response = await apiClient.get<any>('/auth/me');
      return this.mapUser(response);
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    await apiClient.post<any>('/auth/logout');
  }
}
