import DeleteParamsDto from '@/dtos/delete.params.dto';
import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import TagCreateDto from '@/server/tag/dtos/tag.create.dto';
import TagListQueryDto from '@/server/tag/dtos/tag.list.query.dto';
import TagUpdateDto from '@/server/tag/dtos/tag.update.dto';
import { UserLevel } from '@/server/user/types/UserLevel';
import { HttpStatus } from '@/types/HttpStatus';
import { cacheControl } from '@/utils/constants';
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
  SetHeader,
  ValidationPipe,
} from 'next-api-decorators';

class TagHandler {
  @Get()
  @ParseQueryGuard()
  @SetHeader('Cache-Control', cacheControl)
  async findAll(
    @Query(ValidationPipe)
    query: TagListQueryDto,
  ) {
    const { page, limit, sortField, sortOrder, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, []);
    const list = await prisma.tag.findMany({
      where: conditions,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.tag.count({ where: conditions });
    return {
      list: list.map((item) => {
        const { postIds, ...rest } = item;
        return rest;
      }),
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: TagCreateDto) {
    return prisma.tag.create({ data });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return prisma.tag.deleteMany({ where: { id: { in: query.ids } } });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: TagUpdateDto) {
    return prisma.tag.update({ where: { id }, data });
  }
}

export default createHandler(TagHandler);
