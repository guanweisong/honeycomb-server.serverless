import DeleteParamsDto from '@/dtos/delete.params.dto';
import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import Captcha from '@/middlewares/captcha.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import CommentCreateDto from '@/server/comment/dtos/comment.create.dto';
import CommentListQueryDto from '@/server/comment/dtos/comment.list.query.dto';
import CommentUpdateDto from '@/server/comment/dtos/comment.update.dto';
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
// @ts-ignore
import listToTree from 'list-to-tree-lite';
import md5 from 'md5';
import * as mongoose from 'mongoose';

class CommentsHandler {
  @Get()
  @ParseQueryGuard()
  async findAll(
    @Query(ValidationPipe)
    query: CommentListQueryDto,
  ) {
    const { page, limit, sortField, sortOrder, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, []);
    const list = await prisma.comment.findMany({
      where: conditions,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.comment.count({ where: rest });
    return {
      list,
      total,
    };
  }

  @Get('/:id')
  async findByPostId(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    const condition = {
      postId: id,
      status: { in: [1, 3] },
    };
    const result = prisma.comment.findMany({ where: condition, orderBy: { updatedAt: 'desc' } });
    const list =
      result.length > 0
        ? listToTree(
            result.map((item) => {
              return {
                ...item,
                id: item.id.toString(),
                comment_avatar: `https://cravatar.cn/avatar/${md5(
                  item.comment_email.trim().toLowerCase(),
                )}?s=48&d=identicon`,
              };
            }),
            {
              idKey: 'id',
              parentKey: 'parentId',
            },
          )
        : [];
    const total = await prisma.comment.count({ where: condition });
    return {
      list,
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Captcha()
  async create(@Body(ValidationPipe) data: CommentCreateDto) {
    return prisma.comment.create({ data });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return prisma.comment.deleteMany({ where: { id: { in: query.ids } } });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: CommentUpdateDto) {
    return prisma.comment.update({ where: { id }, data });
  }
}

export default createHandler(CommentsHandler);
