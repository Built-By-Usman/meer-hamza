import { User } from '../../types';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<LoginResponse>;
  getCurrentUser(token: string): Promise<User | null>;
  logout(): Promise<void>;
}
