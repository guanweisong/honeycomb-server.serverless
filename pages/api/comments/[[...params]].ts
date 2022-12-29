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
// @ts-ignore
import listToTree from 'list-to-tree-lite';
import md5 from 'md5';
import TagListQueryDto from '@/server/tag/dtos/tag.list.query.dto';
import Comment from '@/server/comment/models/comment';
import DatabaseGuard from '@/middlewares/database.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import * as mongoose from 'mongoose';
import { HttpStatus } from '@/types/HttpStatus';
import DeleteParamsDto from '@/dtos/delete.params.dto';
import CommentCreateDto from '@/server/comment/dtos/comment.create.dto';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';
import Captcha from '@/middlewares/captcha.middlewar';

class CommentsHandler {
  @Get()
  @ParseQueryGuard()
  @DatabaseGuard()
  async findAll(
    @Query(ValidationPipe)
    query: TagListQueryDto,
  ) {
    const { page, limit, ...rest } = query;
    const list = await Comment.find(rest)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updated_at: -1 })
      .lean();
    const total = await Comment.count(rest);
    return {
      list,
      total,
    };
  }

  @Get('/:id')
  async findByPostId(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    const conditions = {
      comment_post: id,
      comment_status: { $in: [1, 3] },
    };
    const result = await Comment.find(conditions).sort({ updated_at: -1 }).lean();
    const list =
      result.length > 0
        ? listToTree(
            result.map((item) => {
              return {
                ...item,
                _id: item._id.toString(),
                comment_avatar: `//www.gravatar.com/avatar/${md5(
                  item.comment_email.trim().toLowerCase(),
                )}?s=48&d=identicon`,
              };
            }),
            {
              idKey: '_id',
              parentKey: 'comment_parent',
            },
          )
        : [];
    const total = await Comment.count(conditions);
    return {
      list,
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Captcha()
  async create(@Body(ValidationPipe) data: CommentCreateDto) {
    const model = new Comment(data);
    return model.save();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return Comment.deleteMany({ _id: { $in: query.ids } });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: CommentCreateDto) {
    return Comment.findByIdAndUpdate(id, data);
  }
}

export default createHandler(CommentsHandler);
