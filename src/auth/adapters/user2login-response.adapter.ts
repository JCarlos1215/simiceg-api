import jwt from 'jsonwebtoken';

import { User } from '@src/modules/user/models/user';
import { LoginResponse } from '../models/login.response';
import environment from '@src/utils/environment';

export function user2loginResponse(user: User): LoginResponse {
  return {
    idUser: user.idUser,
    username: user.username,
    token: jwt.sign({ idUser: user.idUser }, environment.ACCESS_TOKEN_SECRET, { expiresIn: '8h' }),
    idRol: user.idRol,
    fullName: `${user.givenname} ${user.surname}`,
    job: user.job,
    company: user.company,
  };
}
