import {
  createHandler,
  ValidationPipe,
  Get,
  Post,
  Delete,
  Patch,
  Query,
  Body,
  Param,
  HttpCode,
} from 'next-api-decorators';
import Tools from '@/utils/tools';
import CategoryListQueryDto from '@/server/category/dtos/category.list.query.dto';
import Category from '@/server/category/models/category';
import DatabaseGuard from '@/middlewares/database.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import { HttpStatus } from '@/types/HttpStatus';
import CategoryCreateDto from '@/server/category/dtos/category.create.dto';
import DeleteParamsDto from '@/dtos/delete.params.dto';
import CategoryUpdateDto from '@/server/category/dtos/category.update.dto';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';

class TagsHandler {
  @Get()
  @ParseQueryGuard()
  @DatabaseGuard()
  async findAll(
    @Query(ValidationPipe)
    query: CategoryListQueryDto,
  ) {
    const { page, limit, id } = query;
    const list = await Category.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updated_at: -1 })
      .lean();
    const total = await Category.count();
    return {
      list: Tools.sonsTree(list, id),
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: CategoryCreateDto) {
    const model = new Category(data);
    return model.save();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return Category.deleteMany({ _id: { $in: query.ids } });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: CategoryUpdateDto) {
    return Category.findByIdAndUpdate(id, data);
  }
}

export default createHandler(TagsHandler);
