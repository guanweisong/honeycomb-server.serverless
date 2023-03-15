import prisma from '@/libs/prisma';
import { UserLevel } from '@/server/user/types/UserLevel';
import { UserStatus } from '@/server/user/types/UserStatus';
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMiddlewareDecorator, ForbiddenException, NextFunction } from 'next-api-decorators';

const Auth = (roles: UserLevel[]) =>
  createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
      const jwtToken = req.headers['x-auth-token'] as string;
      if (!jwtToken) {
        throw new ForbiddenException('权限不足');
      }
      const tokenInfo = await prisma.token.findUnique({ where: { content: jwtToken } });
      if (!tokenInfo) {
        throw new ForbiddenException();
      }
      if (moment().unix() - moment(tokenInfo.updatedAt).unix() > Number(process.env.JWT_EXPIRES)) {
        await prisma.token.delete({ where: { content: jwtToken } });
        throw new ForbiddenException('身份已过期');
      }
      const { userId } = tokenInfo;
      const userInfo = await prisma.user.findUnique({ where: { id: userId } });
      if (!userInfo) {
        throw new ForbiddenException('用户已被删除');
      }
      if (userInfo.status === UserStatus.DELETED) {
        throw new ForbiddenException('用户已被禁用');
      }
      if (!roles.includes(userInfo.level)) {
        throw new ForbiddenException('权限不足');
      }
      // @ts-ignore
      req.user = userInfo;
      next();
    },
  );

export default Auth;
