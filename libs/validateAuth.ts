import { NextRequest } from 'next/server';
import { getAuthToken } from '@/libs/getAuthToken';
import prisma from '@/libs/prisma';
import moment from 'moment/moment';
import { UserLevel, UserStatus } from '.prisma/client';

export const validateAuth = async (request: NextRequest, roles: UserLevel[]) => {
  const jwtToken = getAuthToken(request);
  if (!jwtToken) {
    return {
      isOk: false,
      message: '权限不足',
    };
  }
  const tokenInfo = await prisma.token.findUnique({ where: { content: jwtToken } });
  if (!tokenInfo) {
    return {
      isOk: false,
      message: '权限不足',
    };
  }
  if (moment().unix() - moment(tokenInfo.updatedAt).unix() > Number(process.env.JWT_EXPIRES)) {
    await prisma.token.delete({ where: { content: jwtToken } });
    return {
      isOk: false,
      message: '身份已过期',
    };
  }
  const { userId } = tokenInfo;
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) {
    return {
      isOk: false,
      message: '用户已被删除',
    };
  }
  if (userInfo.status === UserStatus.DELETED) {
    return {
      isOk: false,
      message: '用户已被禁用',
    };
  }
  if (!roles.includes(userInfo.level)) {
    return {
      isOk: false,
      message: '权限不足',
    };
  }
  return {
    isOk: true,
    data: userInfo,
  };
};
