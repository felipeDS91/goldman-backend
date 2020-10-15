import './bootstrap';
import 'express-async-errors';

import Youch from 'youch';
import express from 'express';
import cors from 'cors';
import { ValidationError } from 'yup';
import routes from './routes';
import uploadConfig from './config/upload';

import database from './database';
import AppError from './app/errors/AppError';

class App {
  constructor() {
    this.database = database;
    this.server = express();

    this.middlewares();
    this.routes();
    this.handleException();
  }

  middlewares() {
    this.server.use(
      cors({
        origin: process.env.URL_FRONTEND,
        optionsSuccessStatus: 200,
      })
    );
    this.server.use(express.json());

    // to server static files
    this.server.use('/files', express.static(uploadConfig.uploadsFolder));
  }

  routes() {
    this.server.use(routes);
  }

  handleException() {
    this.server.use(async (err, req, res, next) => {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      if (err instanceof ValidationError) {
        return res
          .status(400)
          .json({ error: 'Validation fails', messages: err.inner });
      }

      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({
        error: 'Internal Server Error',
      });
    });
  }
}

export default new App().server;
