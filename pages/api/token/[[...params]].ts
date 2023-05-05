import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import TokenListQueryDto from '@/server/token/dtos/token.list.query.dto';
import { UserLevel } from '@/server/user/types/UserLevel';
import { HttpStatus } from '@/types/HttpStatus';
import { createHandler, Get, HttpCode, Query, ValidationPipe } from 'next-api-decorators';

class TokensHandler {
  @Get()
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN])()
  async findAll(
    @Query(ValidationPipe)
    query: TokenListQueryDto,
  ) {
    const { page, limit } = query;
    const list = await prisma.token.findMany({
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.token.count();
    return {
      list,
      total,
    };
  }

  @Get('/clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth([UserLevel.ADMIN])()
  async clear() {
    return prisma.token.deleteMany({});
  }
}

export default createHandler(TokensHandler);
