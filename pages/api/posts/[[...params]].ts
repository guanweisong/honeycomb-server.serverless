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
import PostModal from '@/server/post/models/post';
import Comment from '@/server/comment/models/comment';
import Category from '@/server/category/models/category';
import Tag from '@/server/tag/models/tag';
import User from '@/server/user/models/user';
import Media from '@/server/media/models/media';
import { HttpStatus } from '@/types/HttpStatus';
import UserCreateDto from '@/server/user/dtos/user.create.dto';
import DeleteParamsDto from '@/dtos/delete.params.dto';
import UserUpdateDto from '@/server/user/dtos/user.update.dto';
import * as mongoose from 'mongoose';
import PostListQueryDto from '@/server/post/dtos/post.list.query.dto';
import { SortType } from '@/types/SortType';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';

const converter = new showdown.Converter();

class PostsHandler {
  @Get()
  @ParseQueryGuard()
  @DatabaseGuard()
  async findAll(
    @Query(ValidationPipe)
    query: PostListQueryDto,
  ) {
    const { page, limit, category_id, tag_name, user_name, sortField, sortOrder, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(
      rest,
      ['post_status', 'post_author', 'post_type', 'post_category'],
      ['post_title', 'quote_author', 'quote_content'],
    );
    const $or = [];
    if (category_id) {
      const categoryList = await Category.find({ _id: category_id });
      $or.push({ post_category: category_id });
      categoryList.forEach((item) => {
        $or.push({ post_category: item._id });
      });
    }
    if (tag_name) {
      const tag = {
        list: await Tag.find({ tag_name }),
        total: await Tag.count({ tag_name }),
      };
      if (tag.total !== 0) {
        const id = tag.list[0]._id;
        $or.push(
          { gallery_style: id },
          { movie_actor: id },
          { movie_style: id },
          { movie_director: id },
        );
      } else {
        return {
          list: [],
          total: 0,
        };
      }
    }
    if (user_name) {
      const user = {
        list: await User.find({ user_name }),
        total: await User.count({ user_name }),
      };
      if (user.total !== 0) {
        conditions.post_author = user.list[0]._id;
      } else {
        return {
          list: [],
          total: 0,
        };
      }
    }
    if ($or.length > 0) {
      conditions.$or = $or;
    }
    const list = await PostModal.find(conditions)
      .sort({ [sortField]: SortType[sortOrder] })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({ path: 'post_category', model: Category, select: 'category_title' })
      .populate({ path: 'post_author', model: User, select: 'user_name' })
      .populate({ path: 'movie_director', model: Tag, select: 'tag_name' })
      .populate({ path: 'movie_actor', model: Tag, select: 'tag_name' })
      .populate({ path: 'movie_style', model: Tag, select: 'tag_name' })
      .populate({ path: 'gallery_style', model: Tag, select: 'tag_name' })
      .populate({ path: 'post_cover', model: Media, select: 'media_url' })
      .lean();
    for (const item of list) {
      const count = await Comment.count({
        comment_post: item._id,
        comment_status: { $in: [1, 3] },
      });
      item.comment_count = count;
    }
    const total = await PostModal.count(conditions);
    return { list, total };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: UserCreateDto) {
    const model = new PostModal(data);
    return model.save();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return PostModal.deleteMany({ _id: { $in: query.ids } });
  }

  @Get('/:id')
  async findOne(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    const result = await PostModal.findOne({ _id: id })
      .populate({ path: 'post_category', model: Category, select: 'category_title' })
      .populate({ path: 'post_author', model: User, select: 'user_name' })
      .populate({ path: 'movie_director', model: Tag, select: 'tag_name' })
      .populate({ path: 'movie_actor', model: Tag, select: 'tag_name' })
      .populate({ path: 'movie_style', model: Tag, select: 'tag_name' })
      .populate({ path: 'gallery_style', model: Tag, select: 'tag_name' })
      .populate({ path: 'post_cover', model: Media, select: 'media_url' })
      .lean();
    result.post_content = converter.makeHtml(result.post_content);
    return result;
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: UserUpdateDto) {
    return PostModal.findByIdAndUpdate(id, data);
  }

  @Get('/:id/views')
  findViews(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return PostModal.findOne(id).then((result) => ({ count: result.post_views }));
  }

  @Patch('/:id/views')
  @HttpCode(HttpStatus.CREATED)
  updateViews(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return PostModal.findByIdAndUpdate({ _id: id }, { $inc: { post_views: 1 } }, { upsert: true });
  }
}

export default createHandler(PostsHandler);
