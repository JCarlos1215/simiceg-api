import express, { Request, Response } from 'express';
const router = express.Router();

import logger from '@src/utils/logger';
import { ResponseObject } from '@src/utils/response-object';
import { BBox } from 'geojson';
import { SnapController } from './snap.controller';
import { ERROR_CODE } from '@src/utils/response-codes';
import { ErrorResponseObject } from '@src/utils/response-error-object';
import { container } from 'tsyringe';
import passport from 'passport';

router.get('/layers', passport.authenticate('bearer', { session: false }), async (req: Request, res: Response) => {
  try {
    const controller = container.resolve(SnapController);
    const layers = await controller.getAvailableLayers();
    res.json(new ResponseObject(layers));
  } catch (e) {
    logger.error('[Modulo: SNAP][GET /] Error', e.message, e);
    res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject('Server Error', ERROR_CODE.SERVER_ERROR));
  }
});

router.get(
  '/:idlayer/query',
  passport.authenticate('bearer', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const bbox: number[] = (req.query.bbox as string).split(',').map((x) => parseFloat(x));
      const scale: number = parseFloat(req.query.scale as string);
      if (bbox.length === 4) {
        const controller = container.resolve(SnapController);
        const results = await controller.getSnapGeometriesForLayer(req.params.idlayer, bbox as BBox, scale);
        res.json(new ResponseObject(results));
      } else {
        res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject('Bad request', ERROR_CODE.BAD_REQUEST));
      }
    } catch (e) {
      logger.error('[Modulo: SNAP][GET /:idlayer/query] Error', e.message, e);
      res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject('Server Error', ERROR_CODE.SERVER_ERROR));
    }
  }
);

export { router };
