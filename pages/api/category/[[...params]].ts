import DeleteParamsDto from '@/dtos/delete.params.dto';
import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import CategoryCreateDto from '@/server/category/dtos/category.create.dto';
import CategoryListQueryDto from '@/server/category/dtos/category.list.query.dto';
import CategoryUpdateDto from '@/server/category/dtos/category.update.dto';
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

class CategoriesHandler {
  @Get()
  @ParseQueryGuard()
  @SetHeader('Cache-Control', cacheControl)
  async findAll(
    @Query(ValidationPipe)
    query: CategoryListQueryDto,
  ) {
    const { page, limit, id, sortField, sortOrder, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, []);
    const list = await prisma.category.findMany({
      where: conditions,
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.category.count();
    return {
      list: Tools.sonsTree(list, id),
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: CategoryCreateDto) {
    return prisma.category.create({ data });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return prisma.category.deleteMany({ where: { id: { in: query.ids } } });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: CategoryUpdateDto) {
    return prisma.category.update({ where: { id }, data });
  }
}

export default createHandler(CategoriesHandler);
