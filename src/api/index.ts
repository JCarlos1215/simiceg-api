import express, { Request, Response } from 'express';
const router = express.Router();

import { ResponseObject } from '@src/utils/response-object';

import { router as AuthRouter } from '@src/auth/auth.router';
import { router as UserRouter } from '@src/modules/user/user.router';
import { router as TocRouter } from '@src/modules/toc/toc.router';
import { router as SnapRouter } from '@src/modules/snap/snap.router';
import { router as GraphRouter } from '@src/modules/graph/graph.router';
import { router as SearchRouter } from '@src/modules/search/search.router';
import { router as CatastroRouter } from '@src/modules/catastro/catastro.router';

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/toc', TocRouter);
router.use('/snap', SnapRouter);
router.use('/graph', GraphRouter);
router.use('/search', SearchRouter);
router.use('/catastro', CatastroRouter);

router.get('/', (req: Request, res: Response) => {
  res.json(new ResponseObject(`Welcome to API skeleton.`));
});

export { router };
