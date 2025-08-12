import express, { Request, Response } from 'express';
const router = express.Router();

import { container } from 'tsyringe';
import logger from '@src/utils/logger';
import { ERROR_CODE } from '@src/utils/response-codes';
import { ErrorResponseObject } from '@src/utils/response-error-object';
import { ResponseObject } from '@src/utils/response-object';

import { Toc } from './models/toc';
import { TocController } from './toc.controller';
import { ValidationParamsTocError } from './errors/validation-params-toc.error';
import passport from 'passport';
import { User } from '../user/models/user';

/**
 * @apiIgnore
 * @api {get} / Return toc
 * @apiName GetToc
 * @apiGroup Toc
 * @apiDescription Obtiene la información del toc para un usuario segun su rol
 *
 * @apiPermission toc:{}
 *
 * @apiHeader {String} authorization Token JWT de autenticacion
 *
 * @apiUse NewGraph
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {GraphData} data  Objeto de respuesta
 *
 * @apiUse GraphData
 *
 * @apiError (Error HTTP 400) ValidationError Los datos proporcionados estan incompletos o no son del tipo correcto.
 * @apiError (Error HTTP 401) AuthenticationError Las credenciales de acceso proporcionadas no corresponden con ningun usuario.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 *
 */
router.get('/', passport.authenticate('bearer', { session: false }), async (req: Request, res: Response) => {
  try {
    const user: User = req.user as User;
    if (user) {
      const controller = container.resolve(TocController);
      const toc: Toc = await controller.getToc(user.idRol);
      res.json(new ResponseObject(toc));
    } else {
      throw new ValidationParamsTocError('No se cuenta con token no ha iniciado sesión');
    }
  } catch (err) {
    logger.error(err, '[Modulo: Toc][GET /] Error: %s', err.message);
    if (err instanceof ValidationParamsTocError) {
      res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.SERVER_ERROR));
    } else {
      res
        .status(ERROR_CODE.SERVER_ERROR)
        .json(new ErrorResponseObject(`No se pudo procesar su solicitud`, ERROR_CODE.SERVER_ERROR));
    }
  }
});

export { router };
