import DeleteParamsDto from '@/dtos/delete.params.dto';
import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import PageCreateDto from '@/server/page/dtos/page.create.dto';
import PageListQueryDto from '@/server/page/dtos/page.list.query.dto';
import PageUpdateDto from '@/server/page/dtos/page.update.dto';
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
const showdown = require('showdown');

const converter = new showdown.Converter();

class PagesHandler {
  @Get()
  @ParseQueryGuard()
  async findAll(
    @Query(ValidationPipe)
    query: PageListQueryDto,
  ) {
    const { page, limit, sortField, sortOrder, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, ['status', 'author']);
    const list = await prisma.page.findMany({
      where: conditions,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const total = await prisma.page.count({ where: conditions });
    return {
      list: list.map((item) => {
        const { authorId, ...rest } = item;
        return rest;
      }),
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: PageCreateDto) {
    return prisma.page.create({ data });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return prisma.page.deleteMany({ where: { id: { in: query.ids } } });
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const result = await prisma.page.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (result) {
      result.content = converter.makeHtml(result.content);
    }
    return result;
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: PageUpdateDto) {
    return prisma.page.update({ where: { id }, data });
  }

  @Get('/:id/views')
  async findViews(@Param('id') id: string) {
    return prisma.page.findUnique({ where: { id } }).then((result) => ({ count: result?.views }));
  }

  @Patch('/:id/views')
  @HttpCode(HttpStatus.CREATED)
  updateViews(@Param('id') id: string) {
    return prisma.page.update({ where: { id }, data: { views: { increment: 1 } } });
  }
}

export default createHandler(PagesHandler);
