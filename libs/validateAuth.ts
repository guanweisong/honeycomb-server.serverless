import { NextRequest } from 'next/server';
import { getAuthToken } from '@/libs/getAuthToken';
import prisma from '@/libs/prisma';
import moment from 'moment/moment';
import { User, UserLevel, UserStatus } from '.prisma/client';
import ResponseHandler from '@/libs/responseHandler';

export const validateAuth = async (
  request: NextRequest,
  roles: UserLevel[],
  onSuccess: (data: User) => void,
  onFail?: () => void,
) => {
  const jwtToken = getAuthToken(request);
  const withOnFail = (fn: () => void) => {
    if (onFail) {
      return onFail();
    } else {
      return fn();
    }
  };
  if (!jwtToken) {
    return withOnFail(() => ResponseHandler.Forbidden({ message: '权限不足' }));
  }
  const tokenInfo = await prisma.token.findUnique({ where: { content: jwtToken } });
  if (!tokenInfo) {
    return withOnFail(() => ResponseHandler.Forbidden({ message: '权限不足' }));
  }
  if (moment().unix() - moment(tokenInfo.updatedAt).unix() > Number(process.env.JWT_EXPIRES)) {
    await prisma.token.delete({ where: { content: jwtToken } });
    return withOnFail(() => ResponseHandler.Forbidden({ message: '身份已过期' }));
  }
  const { userId } = tokenInfo;
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) {
    return withOnFail(() => ResponseHandler.Forbidden({ message: '用户已被删除' }));
  }
  if (userInfo.status === UserStatus.DELETED) {
    onFail?.();
    return withOnFail(() => ResponseHandler.Forbidden({ message: '用户已被禁用' }));
  }
  if (!roles.includes(userInfo.level)) {
    onFail?.();
    return withOnFail(() => ResponseHandler.Forbidden({ message: '权限不足' }));
  }
  onSuccess(userInfo);
};
