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
import LinkListQueryDto from '@/server/link/dtos/link.list.query.dto';
import Link from '@/server/link/models/link';
import DatabaseGuard from '@/middlewares/database.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import { HttpStatus } from '@/types/HttpStatus';
import LinkCreateDto from '@/server/link/dtos/link.create.dto';
import DeleteParamsDto from '@/dtos/delete.params.dto';
import LinkUpdateDto from '@/server/link/dtos/link.update.dto';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';

class LinksHandler {
  @Get()
  @ParseQueryGuard()
  @DatabaseGuard()
  async findAll(
    @Query(ValidationPipe)
    query: LinkListQueryDto,
  ) {
    const { page, limit, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, [
      'link_status',
      'link_url',
    ]);
    const list = await Link.find(conditions)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updated_at: -1 })
      .lean();
    const total = await Link.count(conditions);
    return {
      list,
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: LinkCreateDto) {
    const model = new Link(data);
    return model.save();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return Link.deleteMany({ _id: { $in: query.ids } });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: LinkUpdateDto) {
    return Link.findByIdAndUpdate(id, data);
  }
}

export default createHandler(LinksHandler);
