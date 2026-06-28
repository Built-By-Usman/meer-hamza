import { IAuthRepository, LoginResponse } from '../repositories/auth';
import { User } from '../../types';
import { USERS } from '../../data/db';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockAuthRepository implements IAuthRepository {
  private latency = 500;

  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(this.latency);
    
    // Find in mock database
    const user = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Return mock token containing user ID
    return {
      token: `mock-jwt-token-for-${user.id}`,
      user: { ...user },
    };
  }

  async getCurrentUser(token: string): Promise<User | null> {
    await delay(this.latency / 2);
    
    if (!token || !token.startsWith('mock-jwt-token-for-')) {
      return null;
    }

    const userId = token.replace('mock-jwt-token-for-', '');
    const user = USERS.find((u) => u.id === userId);

    return user ? { ...user } : null;
  }

  async logout(): Promise<void> {
    await delay(this.latency / 4);
    return;
  }
}
