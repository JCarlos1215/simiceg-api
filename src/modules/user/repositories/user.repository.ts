import { NewUser } from '../models/new-user';
import { User } from '../models/user';

export interface UserRepository {
  getUserById(idUser: string): Promise<User>;
  saveUser(user: NewUser): Promise<User>;
  changePassword(idUser: string, password: string): Promise<User>;
}
