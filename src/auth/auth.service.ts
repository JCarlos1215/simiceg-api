import { injectable, inject, registry } from 'tsyringe';

import { User } from '@src/modules/user/models/user';
import { UserService } from '@src/modules/user/user.service';
import { AuthRepository } from './repositories/auth.repository';
import { AuthPGRepository } from './repositories/auth.pg.repository';
import { LoginRequest } from './models/login.request';

@injectable()
@registry([{ token: 'AuthRepository', useClass: AuthPGRepository }])
export class AuthService {
  constructor(@inject('AuthRepository') private authRepository: AuthRepository, private userService: UserService) {}

  public async authenticate(loginData: LoginRequest): Promise<User> {
    const userId: string = await this.authRepository.findUser(loginData);
    const user: User = await this.userService.findUser(userId);
    return user;
  }
}
