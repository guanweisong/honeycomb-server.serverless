import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import Captcha from '@/middlewares/captcha.middlewar';
import { TokenAgent } from '@/middlewares/token.agent.middlewar';
import LoginDto from '@/server/auth/dtos/login.dto';
import { UserLevel } from '@/server/user/types/UserLevel';
import { UserStatus } from '@/server/user/types/UserStatus';
import { HttpStatus } from '@/types/HttpStatus';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  Body,
  createHandler,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  Res,
  ValidationPipe,
} from 'next-api-decorators';
import { encode } from 'next-auth/jwt';

class AuthHandler {
  @Post('/login')
  @Captcha()
  async login(@Body(ValidationPipe) data: LoginDto, @Res() res: NextApiResponse) {
    const { name, password } = data;
    const userInfo = await prisma.user.findFirst({
      where: { name, password },
    });
    if (!userInfo) {
      throw new HttpException(HttpStatus.FORBIDDEN, '用户名或密码错误');
    }
    if (userInfo.status === UserStatus.DISABLE) {
      throw new HttpException(HttpStatus.FORBIDDEN, '该用户已被禁用，请联系管理员');
    }
    if (userInfo.status === UserStatus.DELETED) {
      throw new HttpException(HttpStatus.FORBIDDEN, '该用户已被删除，请联系管理员');
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
    res.send({ OK: true, token: tokenContent });
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@TokenAgent() token: string, @Res() res: NextApiResponse) {
    if (token) {
      await prisma.token.delete({ where: { content: token } });
    }
    res.send({ OK: true });
  }

  @Get('/queryUser')
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR, UserLevel.GUEST])()
  async verify(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
    // @ts-ignore
    if (req.user) {
      // @ts-ignore
      res.send(req.user);
    } else {
      res.send(false);
    }
  }
}
export default createHandler(AuthHandler);
