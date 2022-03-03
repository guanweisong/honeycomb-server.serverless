import {
  createMiddlewareDecorator,
  HttpException,
  NextFunction,
} from '@storyofams/next-api-decorators';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { HttpStatus } from '@/types/HttpStatus';

const Captcha = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const { captcha } = req.body;
    if (!captcha) {
      throw new HttpException(HttpStatus.FORBIDDEN, '请输入验证码');
    }
    const result = await axios.request({
      url: 'https://ssl.captcha.qq.com/ticket/verify',
      method: 'GET',
      params: {
        aid: process.env.CAPTCHA_AID,
        AppSecretKey: process.env.CAPTCHA_APP_SECRET_KEY,
        Randstr: captcha.randstr,
        Ticket: captcha.ticket,
        // UserIP: req,
      },
    });
    // @ts-ignore
    if (result.status === 200 && result.data.response === '1') {
      next();
    } else {
      throw new HttpException(HttpStatus.FORBIDDEN, '验证码不正确');
    }
  },
);

export default Captcha;
