import express, { Request, Response } from 'express';
const router = express.Router();

import { ValidationError } from 'joi';
import { container } from 'tsyringe';

import logger from '@src/utils/logger';
import { ERROR_CODE } from '@src/utils/response-codes';
import { ErrorResponseObject } from '@src/utils/response-error-object';
import { ResponseObject } from '@src/utils/response-object';

import newUserSchema, { NewUser } from './models/new-user';
import { UserController } from './user.controller';
import { DuplicatedUsernameError } from './errors/duplicated-username.error';
import { ValidationParamsUserError } from './errors/validation-params.error';
import passport from 'passport';

/**
 * @api {post} /user Crea nuevo usuario
 * @apiName CreateUser
 * @apiGroup User
 * @apiDescription Crea un nuevo usuario en el sistema para entrar en visor.
 * @apiVersion 0.0.1
 * @apiSampleRequest http://ip.ip.ip.ip/api/user
 * @apiPermission authenticated
 *
 * @apiHeader {String} authorization Token JWT de autenticación
 *
 * @apiUse NewUser
 * @apiUse User
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {User} data Objeto de respuesta
 *
 * @apiError (Error HTTP 400) ValidationError Los datos proporcionados estan incompletos o no son del tipo correcto.
 * @apiError (Error HTTP 400) DuplicatedUsernameError El usuario esta duplicado por lo que ya existe en el sistema.
 * @apiError (Error HTTP 401) AuthenticationError Las credenciales de acceso proporcionadas no corresponden con ningun usuario.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 */
router.post('/', passport.authenticate('bearer', { session: false }), async (req: Request, res: Response) => {
  try {
    const newUser: NewUser = await newUserSchema.validateAsync(req.body);
    const controller = container.resolve(UserController);
    const user = await controller.createUser(newUser);
    res.status(201).json(new ResponseObject(user));
  } catch (err) {
    logger.error(err, '[Modulo: Auth][POST /] Error: %s', err.message);
    if (err instanceof ValidationError) {
      res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.BAD_REQUEST));
    } else if (err instanceof DuplicatedUsernameError) {
      res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.BAD_REQUEST));
    } else {
      res
        .status(ERROR_CODE.SERVER_ERROR)
        .json(new ErrorResponseObject(`No se pudo procesar su solicitud`, ERROR_CODE.SERVER_ERROR));
    }
  }
});

/**
 * @api {post} /user/:idUser/password Cambia la contraseña de un usuario.
 * @apiName ChangePassword
 * @apiGroup User
 * @apiDescription Cambia el password de un usuario del sistema.
 * @apiVersion 0.0.1
 * @apiSampleRequest http://ip.ip.ip.ip/api/user/:idUser/password
 * @apiPermission authenticated
 *
 * @apiHeader {String} authorization Token JWT de autenticacion
 *
 * @apiParam (Params) idUser **Requerido** Cadena con el identificador del usuario a cambiar contraseña.
 * @apiParam (Body) {String} password Nueva contraseña para el usuario
 *
 * @apiUse User
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {User} user Objeto de respuesta
 *
 * @apiError (Error HTTP 400) ValidationParamsUserError Los datos proporcionados estan incompletos o no son del tipo correcto.
 * @apiError (Error HTTP 401) AuthenticationError Las credenciales de acceso proporcionadas no corresponden con ningun usuario.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 */
router.post(
  '/:idUser/password',
  passport.authenticate('bearer', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const controller = container.resolve(UserController);
      const newPassword = req.body.password;
      if (newPassword) {
        const user = await controller.changePassword(req.params.idUser, newPassword);
        res.json(new ResponseObject(user));
      } else {
        throw new ValidationParamsUserError('Se necesita el parametro password');
      }
    } catch (err) {
      logger.error(err, '[Modulo: Auth][POST /:iduser/password] Error: %s', err.message);
      if (err instanceof ValidationParamsUserError) {
        res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject(err.message, ERROR_CODE.BAD_REQUEST));
      } else {
        res
          .status(ERROR_CODE.SERVER_ERROR)
          .json(new ErrorResponseObject(`No se pudo procesar su solicitud`, ERROR_CODE.SERVER_ERROR));
      }
    }
  }
);

export { router };
