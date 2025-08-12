import { LoginRequest } from '../models/login.request';

export interface AuthRepository {
  findUser(loginData: LoginRequest): Promise<string>;
}
