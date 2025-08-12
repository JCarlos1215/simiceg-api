import { injectable } from 'tsyringe';

import { User } from '@src/modules/user/models/user';
import { AuthService } from './auth.service';
import { AuthorizationError } from './errors/authorization.error';
import { LoginRequest } from './models/login.request';

@injectable()
export class AuthController {
  constructor(private authService: AuthService) {}

  public async login(loginData: LoginRequest): Promise<User> {
    return this.authService.authenticate(loginData);
  }

  public async logout(user: User): Promise<boolean> {
    if (!user) {
      throw new AuthorizationError('No se proporciono un usuario');
    }
    return true;
  }
}
