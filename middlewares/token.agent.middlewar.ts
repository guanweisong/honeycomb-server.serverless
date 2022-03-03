import { createParamDecorator } from '@storyofams/next-api-decorators';

export const TokenAgent = createParamDecorator<string | undefined>(
  (req) => req.headers['x-auth-token'] as string,
);
