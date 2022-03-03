import dbConnect from '@/libs/dbConnect';
import {
  createMiddlewareDecorator,
  NextFunction,
  InternalServerErrorException,
} from '@storyofams/next-api-decorators';
import { NextApiRequest, NextApiResponse } from 'next';

const DatabaseGuard = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    try {
      await dbConnect();
      next();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  },
);

export default DatabaseGuard;
