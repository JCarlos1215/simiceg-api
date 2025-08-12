import bcrypt = require('bcrypt');
import { IDatabase } from 'pg-promise';
import { injectable, inject } from 'tsyringe';

import logger from '@src/utils/logger';

import { NewUser } from '../models/new-user';
import { User } from '../models/user';
import { UserRepository } from './user.repository';
import { DuplicatedUsernameError } from '../errors/duplicated-username.error';

interface DBUserResponse {
  iduser: string;
  username: string;
  created: Date;
  idrol: string;
  givenname: string;
  surname: string;
  company: string;
  job: string;
}

@injectable()
export class UserPGRepository implements UserRepository {
  constructor(@inject('webdbapp') private cnn: IDatabase<unknown>) {}

  public async getUserById(idUser: string): Promise<User> {
    const query = `SELECT u.iduser, username, created, idrol, givenname, surname, company, job
      FROM webapi."user" u
      INNER JOIN webapi."user_detail" d
      ON u.iduser = d.iduser
      WHERE u.iduser = $1
    ;`;

    try {
      const userData: DBUserResponse = await this.cnn.one<DBUserResponse>(query, [idUser]);
      return this.createUserFromDBResponse(userData);
    } catch (err) {
      logger.error(err, `[Modulo: User][UserPGRepository][getUserById] Error: %s`, err.message);
      throw err;
    }
  }

  public async saveUser(user: NewUser): Promise<User> {
    const queryInsert = `INSERT INTO webapi."user"(
      username, pass, idrol)
      VALUES ($1, $2, $3)
      RETURNING iduser
    ;`;
    const queryDetail = `INSERT INTO webapi."user_detail"(
      iduser, givenname, surname, company, job)
      VALUES ($1, $2, $3, $4, $5)
    ;`;
    try {
      const pass = bcrypt.hashSync(user.password, 10);
      const dbResponse: { iduser: string } = await this.cnn.oneOrNone<{ iduser: string }>(queryInsert, [
        user.username,
        pass,
        user.idrol,
      ]);
      console.log(dbResponse.iduser);
      await this.cnn.oneOrNone(queryDetail, [dbResponse.iduser, user.givenname, user.surname, user.company, user.job]);

      return this.getUserById(dbResponse.iduser);
    } catch (err) {
      logger.error(err, `[Modulo: User][UserPGRepository][saveUser] Error: %s`, err.message);
      if (err.code === '23505' || err.code === 23505) {
        throw new DuplicatedUsernameError('El nombre de usuario ya existe');
      } else {
        throw new Error('Error al insertar usuario');
      }
    }
  }

  public async changePassword(idUser: string, password: string): Promise<User> {
    const sqlQuery = `UPDATE webapi."user" 
      SET pass = $2 
      WHERE iduser = $1
      RETURNING iduser
    ;`;
    try {
      const pass = bcrypt.hashSync(password, 10);
      const user = await this.cnn.oneOrNone(sqlQuery, [idUser, pass]);
      return this.getUserById(user.iduser);
    } catch (e) {
      logger.error('[Modulo: User][UserPGRepository: changePassword] Error', e.message, e);
      throw new Error('Error al actualizar');
    }
  }

  private createUserFromDBResponse(userRow: DBUserResponse): User {
    return {
      idUser: userRow.iduser,
      username: userRow.username,
      createdAt: userRow.created,
      idRol: userRow.idrol,
      givenname: userRow.givenname,
      surname: userRow.surname,
      company: userRow.company,
      job: userRow.job,
    };
  }
}
