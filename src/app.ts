import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import path from 'path';
import { container } from 'tsyringe';

import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

import jwt from 'jsonwebtoken';

import dotenv = require('dotenv-safe');
dotenv.config();

import { default as logger, expressLogger } from './utils/logger';

import { ERROR_CODE } from './utils/response-codes';
import { ErrorResponseObject } from './utils/response-error-object';
import { ResponseObject } from './utils/response-object';

import { router as ApiRouter } from './api';
import { IDatabase } from 'pg-promise';
import database from './utils/database';
import environment from './utils/environment';

import { TokenData } from './auth/models/token';
import { UserService } from './modules/user/user.service';

class App {
  public express: express.Application;

  constructor() {
    container.register<IDatabase<unknown>>('geodb', {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (_: unknown): IDatabase<unknown> => {
        return database.connect(environment.STRING_CONNECTION);
      },
    });
    container.register<IDatabase<unknown>>('webdbapp', {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (_: unknown): IDatabase<unknown> => {
        return database.connect(environment.WEBDB_CONNECTION);
      },
    });

    passport.use(
      new BearerStrategy((token, done) => {
        const tokenData: TokenData = jwt.verify(token, environment.ACCESS_TOKEN_SECRET) as TokenData;
        const userService = container.resolve(UserService);
        userService
          .findUser(tokenData.idUser)
          .then((user) => {
            done(null, user);
          })
          .catch((err) => {
            done(err, null);
          });
      })
    );

    this.express = express();
    this.middleware();
    this.routes();
    this.error();
    this.error404();
  }

  private middleware = (): void => {
    this.express.set('trust proxy', true);

    this.express.use(compression());
    this.express.use(cookieParser());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.express.use(helmet());

    this.express.use(expressLogger);

    this.express.use(express.static(path.join(__dirname, 'public')));
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      res.header(
        'Access-Control-Allow-Origin',
        process.env.ENV === 'PROD' ? process.env.ALLOW_ORIGIN : req.headers.origin
      );
      res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
  };

  private routes = (): void => {
    this.express.use('/api', ApiRouter);

    this.express.get('/', (req: Request, res: Response) => {
      res.json(new ResponseObject(`Welcome to APP skeleton.`));
    });
  };

  private error404 = (): void => {
    this.express.use((req: Request, res: Response) => {
      res.status(ERROR_CODE.NOT_FOUND).json(new ErrorResponseObject('Not Found', ERROR_CODE.NOT_FOUND));
    });
  };

  private error = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.express.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
      logger.error(err, 'General Error Handler');
      res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject(err.message, ERROR_CODE.SERVER_ERROR));
    });
  };
}

export default new App().express;
