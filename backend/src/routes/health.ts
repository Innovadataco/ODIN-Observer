import { Request, Response } from 'express';

export const healthRouter = require('express').Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'odin-observer-backend',
    version: '1.0.0'
  });
});

export default healthRouter;
