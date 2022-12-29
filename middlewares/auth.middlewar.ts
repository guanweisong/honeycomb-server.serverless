import {
  createMiddlewareDecorator,
  NextFunction,
  ForbiddenException,
} from 'next-api-decorators';
import { NextApiRequest, NextApiResponse } from 'next';
import moment from 'moment';
import Token from '@/server/token/models/token';
import User from '@/server/user/models/user';
import { UserStatus } from '@/server/user/types/UserStatus';
import { UserLevel } from '@/server/user/types/UserLevel';

const Auth = (roles: UserLevel[]) =>
  createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
      const jwtToken = req.headers['x-auth-token'];
      if (!jwtToken) {
        throw new ForbiddenException('权限不足');
      }
      const tokenInfo = await Token.findOne({ token_content: jwtToken }).lean();
      if (!tokenInfo) {
        throw new ForbiddenException();
      }
      if (moment().unix() - moment(tokenInfo.updated_at).unix() > Number(process.env.JWT_EXPIRES)) {
        await Token.deleteOne({ token_content: jwtToken });
        throw new ForbiddenException('身份已过期');
      }
      const { user_id } = tokenInfo;
      const userInfo = await User.findOne({ _id: user_id }).lean();
      if (!userInfo) {
        throw new ForbiddenException('用户已被删除');
      }
      if (userInfo.user_status === UserStatus.DELETE) {
        throw new ForbiddenException('用户已被禁用');
      }
      if (!roles.includes(userInfo.user_level)) {
        throw new ForbiddenException('权限不足');
      }
      // @ts-ignore
      req.user = userInfo;
      next();
    },
  );

export default Auth;
