import {
  createHandler,
  ValidationPipe,
  Get,
  Query,
  HttpCode,
} from '@storyofams/next-api-decorators';
import Token from '@/server/token/models/token';
import DatabaseGuard from '@/middlewares/database.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import { HttpStatus } from '@/types/HttpStatus';
import TokenListQueryDto from '@/server/token/dtos/token.list.query.dto';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';

class TokensHandler {
  @Get()
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN])()
  async findAll(
    @Query(ValidationPipe)
    query: TokenListQueryDto,
  ) {
    const { page, limit, ...rest } = query;
    const list = await Token.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updated_at: -1 })
      .lean();
    const total = await Token.count(rest);
    return {
      list,
      total,
    };
  }

  @Get('/clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN])()
  async clear() {
    return Token.deleteMany();
  }
}

export default createHandler(TokensHandler);
