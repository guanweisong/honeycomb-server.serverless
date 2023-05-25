import { NextRequest } from 'next/server';
import axios from 'axios';

export const validateCaptcha = async (request: NextRequest) => {
  const data = await request.clone().json();
  const { captcha } = data;
  if (!captcha) {
    return {
      isOk: false,
      message: '请输入验证码',
    };
  }
  const result = await axios.request({
    url: 'https://ssl.captcha.qq.com/ticket/verify',
    method: 'GET',
    params: {
      aid: process.env.CAPTCHA_AID,
      AppSecretKey: process.env.CAPTCHA_APP_SECRET_KEY,
      Randstr: captcha.randstr,
      Ticket: captcha.ticket,
    },
  });
  // @ts-ignore
  if (result.status === 200 && result.data.response === '1') {
    return {
      isOk: true,
    };
  } else {
    return {
      isOk: false,
      message: '验证码不正确',
    };
  }
};
