import express, { Request, Response } from 'express';
const router = express.Router();

import { ERROR_CODE } from '@src/utils/response-codes';
import { ErrorResponseObject } from '@src/utils/response-error-object';
import logger from '@src/utils/logger';
import passport from 'passport';
import { container } from 'tsyringe';

import { SearchController } from './search.controller';
import { ResponseObject } from '@src/utils/response-object';
import { SearchError } from './errors/search.error';

router.get('/', passport.authenticate('bearer', { session: false }), async (req: Request, res: Response) => {
  try {
    const searchController = container.resolve(SearchController);
    const searchTerm = String(req.query.filter) || '';
    const result = await searchController.doSearch(searchTerm);
    res.json(new ResponseObject(result));
  } catch (err) {
    logger.error(err, '[Modulo: Search][GET /] Error: %s', err.message);
    if (err instanceof SearchError) {
      res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.BAD_REQUEST));
    } else {
      res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.SERVER_ERROR));
    }
  }
});

export { router };
