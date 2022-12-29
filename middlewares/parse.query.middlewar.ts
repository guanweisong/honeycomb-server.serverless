import { createMiddlewareDecorator, NextFunction } from 'next-api-decorators';
import { NextApiRequest, NextApiResponse } from 'next';
import Tools from '@/utils/tools';

const ParseQueryGuard = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    req.query = Tools.getQueryParams(req.url!);
    next();
  },
);

export default ParseQueryGuard;
