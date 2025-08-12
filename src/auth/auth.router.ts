import express, { Request, Response } from 'express';
const router = express.Router();

import { container } from 'tsyringe';

import { ValidationError } from 'joi';

import { ResponseObject } from '@src/utils/response-object';
import { ERROR_CODE } from '@src/utils/response-codes';

import loginRequestSchema, { LoginRequest } from './models/login.request';
import { ErrorResponseObject } from '@src/utils/response-error-object';
import { AuthenticationError } from './errors/authentication.error';
import { AuthorizationError } from './errors/authorization.error';
import logger from '@src/utils/logger';
import { AuthController } from './auth.controller';
import { user2loginResponse } from './adapters/user2login-response.adapter';
import { User } from '@src/modules/user/models/user';
import { ValidationAuthError } from './errors/validation-auth.error';
import passport from 'passport';

/**
 * @api {post} /auth Autentifica usuario
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiDescription Autentica al usuario y le responde con un token <code>JWT</code> que podra utilizar para acceder a los recursos protegidos.
 * @apiVersion 0.0.1
 * @apiSampleRequest http://ip.ip.ip.ip/api/auth
 *
 * @apiUse LoginRequest
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {LoginResponse} data Objeto de respuesta
 *
 * @apiUse User
 * @apiUse LoginResponse
 *
 * @apiError (Error HTTP 400) ValidationError Los datos proporcionados estan incompletos o no son del tipo correcto.
 * @apiError (Error HTTP 401) AuthenticationError Las credenciales de acceso proporcionadas no corresponden con ningun usuario.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const loginData: LoginRequest = await loginRequestSchema.validateAsync(req.body);
    const controller = container.resolve(AuthController);
    const user: User = await controller.login(loginData);
    const loginResponse = user2loginResponse(user);
    res.json(new ResponseObject(loginResponse));
  } catch (err) {
    logger.error(err, '[Modulo: Auth][POST /] Error: %s', err.message);
    if (err instanceof ValidationError) {
      res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.BAD_REQUEST));
    } else if (err instanceof AuthenticationError) {
      res.status(ERROR_CODE.UNAUTHORIZED).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.UNAUTHORIZED));
    } else {
      res
        .status(ERROR_CODE.SERVER_ERROR)
        .json(new ErrorResponseObject(`No se pudo procesar su solicitud`, ERROR_CODE.SERVER_ERROR));
    }
  }
});

/**
 * @api {delete} /auth Cierra la sesión del usuario
 * @apiName LogoutUser
 * @apiGroup Auth
 * @apiDescription Elimina la sesion del usuario.
 * @apiVersion 0.0.1
 * @apiSampleRequest http://ip.ip.ip.ip/api/auth
 * @apiPermission authenticated
 *
 * @apiHeader {String} authorization Token JWT de autenticación
 * @apiUse User
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {String} data  `'Success'`
 *
 * @apiError (Error HTTP 400) ValidationError El token no es correcto.
 * @apiError (Error HTTP 401) AuthorizationError No hay un usuario autenticado.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 */
router.delete('/', passport.authenticate('bearer', { session: false }), async (req: Request, res: Response) => {
  try {
    const user: User = req.user as User;
    if (user) {
      const controller = container.resolve(AuthController);
      await controller.logout(user);
      res.json(new ResponseObject(`Success`));
    } else {
      throw new ValidationAuthError('No se cuenta con token no ha iniciado sesión');
    }
  } catch (err) {
    logger.error(err, '[Modulo: Auth][DELETE /] Error: %s', err.message);
    if (err instanceof ValidationAuthError) {
      res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.BAD_REQUEST));
    } else if (err instanceof AuthorizationError) {
      res.status(ERROR_CODE.UNAUTHORIZED).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.UNAUTHORIZED));
    } else {
      res
        .status(ERROR_CODE.SERVER_ERROR)
        .json(new ErrorResponseObject(`No se pudo procesar su solicitud`, ERROR_CODE.SERVER_ERROR));
    }
  }
});

export { router };
