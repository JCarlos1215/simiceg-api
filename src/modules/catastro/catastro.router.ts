import express, { Request, Response } from 'express';
const router = express.Router();

import { ERROR_CODE } from '@src/utils/response-codes';
import { ErrorResponseObject } from '@src/utils/response-error-object';
import logger from '@src/utils/logger';

import { container } from 'tsyringe';
import { PredioError } from './errors/predio.error';
import { PredioController } from './controllers/predio.controller';
import { ResponseObject } from '@src/utils/response-object';
import passport from 'passport';
/*import { PredioPresenter } from './presenters/predio.presenter';
import bluebird from 'bluebird';
import fs = require('fs');
import zipstream = require('zip-stream');*/

router.post('/predio', passport.authenticate('bearer', { session: false }), async (req: Request, res: Response) => {
  let predioData;
  try {
    const predioController = container.resolve(PredioController);
    if (req.body.geometry) {
      predioData = await predioController.getPredioByGeometry(req.body.geometry, req.body.options);
    } else if (req.body.x && req.body.y) {
      predioData = await predioController.getPredioByPoint(req.body.x, req.body.y, req.body.options);
    } else {
      throw new PredioError('Se necesita el parametro geometry o el punto como parametros x, y');
    }
    res.json(new ResponseObject({ total: predioData.length, predios: predioData }));
  } catch (err) {
    logger.error(err, '[Modulo: Catastro][POST /predio] Error: %s', err.message);
    if (err instanceof PredioError) {
      res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.BAD_REQUEST));
    } else {
      res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.SERVER_ERROR));
    }
  }
});

router.get(
  '/predio/frente/:idPredioFrente',
  passport.authenticate('bearer', { session: false }),
  async (req: Request, res: Response) => {
    const predioController = container.resolve(PredioController);
    try {
      const heading = await predioController.getHeadingByIdPredioFrente(req.params.idPredioFrente);
      res.json(new ResponseObject(heading));
    } catch (e) {
      logger.error('[Modulo: Catastro][GET /predio/frente/:idPredioFrente] Error', e.message, e);
      res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject(`${e.message}`, ERROR_CODE.SERVER_ERROR));
    }
  }
);

/*router.get('/predio/:clave/download', async (req: Request, res: Response) => {
  try {
    const predioController = container.resolve(PredioController);
    const clave = req.params.clave;
    if (clave) {
      const predioData = await predioController.getPredioByClave(clave, true);
      const predioPlano = new PredioPresenter(predioData).getPredioPlanoAPI();

      const zipPaths = await bluebird.all([
        new Promise((resolveP, rejectP) => {
          fs.writeFile(
            './temp/predio.geojson',
            JSON.stringify({ type: 'FeatureCollection', features: [predioPlano] }, null, 4),
            (err: unknown) => {
              if (err) {
                rejectP(err);
              } else {
                resolveP('./temp/predio.geojson');
              }
            }
          );
        }),
      ]);

      const download = zipPaths.map((item: string) => {
        return {
          path: item,
          name: item.substring(7),
        };
      });

      res.header('Content-Type', 'application/zip');
      res.header('Content-Disposition', `attachment; filename="plano_${clave}.zip"`);

      const zip = zipstream({ level: 1 });
      zip.pipe(res);

      await bluebird.map(
        download,
        (file: { path: string; name: string }) => {
          return new Promise((resolveR, rejectR) => {
            zip.entry(fs.createReadStream(file.path), { name: file.name }, (err: unknown) => {
              if (err) {
                rejectR(err);
              }
              resolveR(file.name);
            });
          });
        },
        { concurrency: 1 }
      );
      zip.finalize();
    } else {
      throw new PredioError('Se necesita el parametro clave del predio');
    }
  } catch (err) {
    logger.error('[Modulo: Catastro][GET /predio/:clave/download] Error', err.message, err);
    if (err instanceof PredioError) {
      res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.BAD_REQUEST));
    } else {
      res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.SERVER_ERROR));
    }
  }
});*/

export { router };
