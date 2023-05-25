import { NextRequest } from 'next/server';
import ResponseHandler from '@/libs/responseHandler';
import prisma from '@/libs/prisma';
import { encode } from 'next-auth/jwt';
import { LoginSchema } from '@/app/auth/schemas/login.schema';
import { validateCaptcha } from '@/libs/validateCaptcha';
import { UserStatus } from '.prisma/client';

export async function POST(request: NextRequest) {
  const data = await request.clone().json();
  const captcha = await validateCaptcha(request);
  if (!captcha.isOk) {
    return ResponseHandler.Forbidden({ message: captcha.message });
  }
  const validate = LoginSchema.safeParse(data);
  if (validate.success) {
    const { name, password } = validate.data;
    const userInfo = await prisma.user.findFirst({
      where: { name, password },
    });
    if (!userInfo) {
      return ResponseHandler.Forbidden({ message: '用户名或密码错误' });
    }
    if (userInfo.status === UserStatus.DISABLE) {
      return ResponseHandler.Forbidden({ message: '该用户已被禁用，请联系管理员' });
    }
    if (userInfo.status === UserStatus.DELETED) {
      return ResponseHandler.Forbidden({ message: '该用户已被删除，请联系管理员' });
    }
    const userId = userInfo.id;
    const tokenContent = await encode({
      token: { userId, createdAt: Date.now() },
      secret: process.env.JWT_SECRET!,
      maxAge: Number(process.env.JWT_EXPIRES),
    });
    const result = await prisma.token.create({
      data: { userId, content: tokenContent },
    });
    return ResponseHandler.Query({ isOk: true, token: tokenContent });
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
