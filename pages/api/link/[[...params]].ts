import DeleteParamsDto from '@/dtos/delete.params.dto';
import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import LinkCreateDto from '@/server/link/dtos/link.create.dto';
import LinkListQueryDto from '@/server/link/dtos/link.list.query.dto';
import LinkUpdateDto from '@/server/link/dtos/link.update.dto';
import { UserLevel } from '@/server/user/types/UserLevel';
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

class LinksHandler {
  @Get()
  @ParseQueryGuard()
  async findAll(
    @Query(ValidationPipe)
    query: LinkListQueryDto,
  ) {
    const { page, limit, sortField, sortOrder, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, ['status']);
    console.log('link find all conditions', conditions);
    const list = await prisma.link.findMany({
      where: conditions,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.link.count({ where: conditions });
    return {
      list,
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: LinkCreateDto) {
    return prisma.link.create({ data });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return prisma.link.deleteMany({ where: { id: { in: query.ids } } });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: LinkUpdateDto) {
    return prisma.link.update({ where: { id }, data });
  }
}

export default createHandler(LinksHandler);
