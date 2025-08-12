import bcrypt = require('bcrypt');
import { IDatabase } from 'pg-promise';
import { injectable, inject } from 'tsyringe';

import { AuthRepository } from './auth.repository';
import { AuthenticationError } from '../errors/authentication.error';
import { LoginRequest } from '../models/login.request';

interface UserDBResponse {
  iduser: string;
  username: string;
  pass: string;
}

@injectable()
export class AuthPGRepository implements AuthRepository {
  constructor(@inject('webdbapp') private cnn: IDatabase<unknown>) {}

  public async findUser(loginData: LoginRequest): Promise<string> {
    const query = `SELECT iduser, username, pass
      FROM webapi."user"
      WHERE username = $1
    ;`;

    try {
      const userData: UserDBResponse = await this.cnn.one<UserDBResponse>(query, [loginData.username]);
      const match = await bcrypt.compare(loginData.password, userData.pass);
      if (!match) {
        throw new AuthenticationError('Las credenciales proporcionadas no coinciden con ningun registro');
      }
      return userData.iduser;
    } catch (err) {
      throw new AuthenticationError('Las credenciales proporcionadas no coinciden con ningun registro');
    }
  }
}
