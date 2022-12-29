import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
  createHandler,
} from '@storyofams/next-api-decorators';
const showdown = require('showdown');
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import DatabaseGuard from '@/middlewares/database.middlewar';
import Tools from '@/utils/tools';
import Page from '@/server/page/models/page';
import { HttpStatus } from '@/types/HttpStatus';
import PageCreateDto from '@/server/page/dtos/page.create.dto';
import DeleteParamsDto from '@/dtos/delete.params.dto';
import PageUpdateDto from '@/server/user/dtos/user.update.dto';
import * as mongoose from 'mongoose';
import PageListQueryDto from '@/server/page/dtos/page.list.query.dto';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';

const converter = new showdown.Converter();

class PagesHandler {
  @Get()
  @ParseQueryGuard()
  @DatabaseGuard()
  async findAll(
    @Query(ValidationPipe)
    query: PageListQueryDto,
  ) {
    const { page, limit, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, [
      'page_status',
      'page_author',
    ]);

    const list = await Page.find(conditions)
      .find(conditions)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updated_at: -1 })
      .populate('page_author', 'user_name')
      .lean();
    const total = await Page.count(conditions);
    return { list, total };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: PageCreateDto) {
    const model = new Page(data);
    return model.save();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return Page.deleteMany({ _id: { $in: query.ids } });
  }

  @Get('/:id')
  async findOne(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    const result = await Page.findOne({ _id: id }).populate('page_author', 'user_name').lean();
    result.page_content = converter.makeHtml(result.page_content);
    return result;
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: PageUpdateDto) {
    return Page.findByIdAndUpdate(id, data);
  }

  @Get('/:id/views')
  async findViews(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return Page.findOne({ _id: id }).then((result) => ({ count: result.page_views }));
  }

  @Patch('/:id/views')
  @HttpCode(HttpStatus.CREATED)
  updateViews(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return Page.findByIdAndUpdate({ _id: id }, { $inc: { page_views: 1 } }, { upsert: true });
  }
}

export default createHandler(PagesHandler);
