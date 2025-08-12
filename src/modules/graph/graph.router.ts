import express, { Request, Response } from 'express';
const router = express.Router();

import { container } from 'tsyringe';
import logger from '@src/utils/logger';
import { ERROR_CODE } from '@src/utils/response-codes';
import { ErrorResponseObject } from '@src/utils/response-error-object';
import { ResponseObject } from '@src/utils/response-object';

import passport from 'passport';
import newGraphSchema, { NewGraph } from './models/new-graph';
import { GraphController } from './graph.controller';
import { GraphError } from './errors/graph.error';

/**
 * @apiIgnore
 * @api {post} /:idlayer Generate graph information
 * @apiName GetGraph
 * @apiGroup Graph
 * @apiDescription Obtiene la información para gráficar una capa del sistema
 *
 * @apiPermission graph:{idlayer}
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
router.post('/:idlayer', passport.authenticate('bearer', { session: false }), async (req: Request, res: Response) => {
  try {
    const graphOptions: NewGraph = await newGraphSchema.validateAsync(req.body);
    const controller = container.resolve(GraphController);
    const data = await controller.getStadisticByIdLayer(req.params.idlayer, graphOptions);
    res.json(new ResponseObject(data));
  } catch (err) {
    logger.error(err, '[Modulo: Graph][POST /:idlayer] Error: %s', err.message);
    if (err instanceof GraphError) {
      res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.SERVER_ERROR));
    } else {
      res
        .status(ERROR_CODE.SERVER_ERROR)
        .json(new ErrorResponseObject(`No se pudo procesar su solicitud`, ERROR_CODE.SERVER_ERROR));
    }
  }
});

export { router };
