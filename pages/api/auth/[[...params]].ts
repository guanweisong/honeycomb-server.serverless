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
import { NextApiRequest, NextApiResponse } from 'next';
import { encode } from 'next-auth/jwt';
import User from '@/server/user/models/user';
import { HttpStatus } from '@/types/HttpStatus';
import LoginDto from '@/server/auth/dtos/login.dto';
import Token from '@/server/token/models/token';
import { UserStatus } from '@/server/user/types/UserStatus';
import DatabaseGuard from '@/middlewares/database.middlewar';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';
import { TokenAgent } from '@/middlewares/token.agent.middlewar';
import Captcha from '@/middlewares/captcha.middlewar';

class AuthHandler {
  @Post('/login')
  @DatabaseGuard()
  @Captcha()
  async login(@Body(ValidationPipe) data: LoginDto, @Res() res: NextApiResponse) {
    const userInfo = await User.findOne({
      ...data,
    }).lean();
    if (!userInfo) {
      throw new HttpException(HttpStatus.FORBIDDEN, '用户名或密码错误');
    }
    if (userInfo.user_status === UserStatus.DISABLE) {
      throw new HttpException(HttpStatus.FORBIDDEN, '该用户已被禁用，请联系管理员');
    }
    if (userInfo.user_status === UserStatus.DELETE) {
      throw new HttpException(HttpStatus.FORBIDDEN, '该用户已被删除，请联系管理员');
    }
    const user_id = userInfo._id;
    const token_content = await encode({
      token: { user_id, created_at: Date.now() },
      secret: process.env.JWT_SECRET!,
      maxAge: Number(process.env.JWT_EXPIRES),
    });

    const tokenModel = new Token({ user_id, token_content });
    await tokenModel.save();
    res.send({ OK: true, token: token_content });
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @DatabaseGuard()
  async logout(@TokenAgent() token: string, @Res() res: NextApiResponse) {
    if (token) {
      await Token.remove({ token_content: token });
    }
    res.send({ OK: true });
  }

  @Get('/queryUser')
  @DatabaseGuard()
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
