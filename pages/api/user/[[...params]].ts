import DeleteParamsDto from '@/dtos/delete.params.dto';
import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import UserCreateDto from '@/server/user/dtos/user.create.dto';
import UserListQueryDto from '@/server/user/dtos/user.list.query.dto';
import UserUpdateDto from '@/server/user/dtos/user.update.dto';
import { UserLevel } from '@/server/user/types/UserLevel';
import { UserStatus } from '@/server/user/types/UserStatus';
import { HttpStatus } from '@/types/HttpStatus';
import Tools from '@/utils/tools';
import {
  Body,
  createHandler,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from 'next-api-decorators';

class UsersHandler {
  @Get()
  @ParseQueryGuard()
  async findAll(
    @Query(ValidationPipe)
    query: UserListQueryDto,
  ) {
    const { page, limit, sortField, sortOrder, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, ['level', 'status', 'id']);
    const list = await prisma.user.findMany({
      where: conditions,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.user.count({ where: conditions });
    return {
      list: list.map((item) => {
        const { password, ...rest } = item;
        return rest;
      }),
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: UserCreateDto) {
    return prisma.user.create({ data });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return prisma.user.updateMany({
      where: { id: { in: query.ids } },
      data: { status: UserStatus.DELETED },
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: UserUpdateDto) {
    return prisma.user.update({ where: { id }, data });
  }
}

export default createHandler(UsersHandler);
