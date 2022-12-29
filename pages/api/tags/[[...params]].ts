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
} from '@storyofams/next-api-decorators';
import Tools from '@/utils/tools';
import TagListQueryDto from '@/server/tag/dtos/tag.list.query.dto';
import Tag from '@/server/tag/models/tag';
import DatabaseGuard from '@/middlewares/database.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import { HttpStatus } from '@/types/HttpStatus';
import TagCreateDto from '@/server/tag/dtos/tag.create.dto';
import DeleteParamsDto from '@/dtos/delete.params.dto';
import TagUpdateDto from '@/server/tag/dtos/tag.update.dto';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';

class TagsHandler {
  @Get()
  @ParseQueryGuard()
  @DatabaseGuard()
  async findAll(
    @Query(ValidationPipe)
    query: TagListQueryDto,
  ) {
    const { page, limit, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, ['tag_name']);
    const list = await Tag.find(conditions)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updated_at: -1 })
      .lean();
    const total = await Tag.count(conditions);
    return {
      list,
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: TagCreateDto) {
    const model = new Tag(data);
    return model.save();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return Tag.deleteMany({ _id: { $in: query.ids } });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: TagUpdateDto) {
    return Tag.findByIdAndUpdate(id, data);
  }
}

export default createHandler(TagsHandler);
