import { injectable } from 'tsyringe';
import { NewUser } from './models/new-user';
import { User } from './models/user';

import { UserService } from './user.service';

@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  public async createUser(user: NewUser): Promise<User> {
    return this.userService.createUser(user);
  }

  public async changePassword(idUser: string, newPass: string): Promise<User> {
    return this.userService.changePassword(idUser, newPass);
  }
}
