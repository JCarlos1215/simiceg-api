import { injectable, inject, registry } from 'tsyringe';
import { NewUser } from './models/new-user';

import { User } from './models/user';
import { UserPGRepository } from './repositories/user.pg.repository';
import { UserRepository } from './repositories/user.repository';

@injectable()
@registry([{ token: 'UserRepository', useClass: UserPGRepository }])
export class UserService {
  constructor(@inject('UserRepository') private userRepository: UserRepository) {}

  public async findUser(idUser: string): Promise<User> {
    return this.userRepository.getUserById(idUser);
  }

  public async createUser(newUser: NewUser): Promise<User> {
    return this.userRepository.saveUser(newUser);
  }

  public async changePassword(idUser: string, newPass: string): Promise<User> {
    return this.userRepository.changePassword(idUser, newPass);
  }
}
