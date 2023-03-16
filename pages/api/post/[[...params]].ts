import DeleteParamsDto from '@/dtos/delete.params.dto';
import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import PostCreateDto from '@/server/post/dtos/post.create.dto';
import PostListQueryDto from '@/server/post/dtos/post.list.query.dto';
import PostRandomListQueryDto from '@/server/post/dtos/post.random.list.query.dto';
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

class PostsHandler {
  @Get()
  @ParseQueryGuard()
  async findAll(
    @Query(ValidationPipe)
    query: PostListQueryDto,
  ) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      tagName,
      userName,
      sortField = 'createdAt',
      sortOrder = 'desc',
      ...rest
    } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, ['status', 'type']);
    const OR = [];
    if (categoryId) {
      const categoryListAll = await prisma.category.findMany();
      const categoryList = Tools.sonsTree(categoryListAll, categoryId);
      OR.push({ categoryId: categoryId });
      categoryList.forEach((item) => {
        OR.push({ categoryId: item.id });
      });
    }
    if (tagName) {
      const tag = {
        list: await prisma.tag.findMany({ where: { name: tagName } }),
        total: await prisma.tag.count({ where: { name: tagName } }),
      };
      if (tag.total) {
        const id = { hasSome: [tag.list[0].id] };
        OR.push(
          { galleryStyleIds: id },
          { movieActorIds: id },
          { movieStyleIds: id },
          { movieDirectorIds: id },
        );
      } else {
        return {
          list: [],
          total: 0,
        };
      }
    }
    if (userName) {
      const user = {
        list: await prisma.user.findMany({ where: { name: userName } }),
        total: await prisma.user.count({ where: { name: userName } }),
      };
      if (user.total) {
        conditions.authorId = user.list[0].id;
      } else {
        return {
          list: [],
          total: 0,
        };
      }
    }
    if (OR.length) {
      conditions.OR = OR;
    }
    console.log('conditions', conditions);
    const list = await prisma.post.findMany({
      where: conditions,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        movieActors: {
          select: {
            id: true,
            name: true,
          },
        },
        movieDirectors: {
          select: {
            id: true,
            name: true,
          },
        },
        galleryStyles: {
          select: {
            id: true,
            name: true,
          },
        },
        movieStyles: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        cover: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
    const total = await prisma.post.count({ where: conditions });
    return {
      list: list.map((item) => {
        const { content, ...rest } = item;
        return rest;
      }),
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: PostCreateDto) {
    return prisma.post.create({ data });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return prisma.post.deleteMany({ where: { id: { in: query.ids } } });
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const result = await prisma.post.findUnique({
      where: { id },
      include: {
        movieActors: {
          select: {
            id: true,
            name: true,
          },
        },
        movieDirectors: {
          select: {
            id: true,
            name: true,
          },
        },
        galleryStyles: {
          select: {
            id: true,
            name: true,
          },
        },
        movieStyles: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        cover: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
    if (result) {
      if (result.content) {
        result.content = converter.makeHtml(result.content);
      }
      return result;
    } else {
      return null;
    }
  }

  @Get('/:id/random')
  @ParseQueryGuard()
  async random(@Param('id') id: string, @Query(ValidationPipe) query: PostRandomListQueryDto) {
    const { number } = query;
    const count = await prisma.post.count();
    const skip = Math.max(0, Math.floor(Math.random() * count) - number);
    return prisma.post.findMany({
      where: { categoryId: id },
      take: number,
      skip: skip,
      select: {
        title: true,
        quoteContent: true,
      },
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: PostCreateDto) {
    return prisma.post.update({ where: { id }, data });
  }

  @Get('/:id/views')
  findViews(@Param('id') id: string) {
    return prisma.post.findUnique({ where: { id } }).then((result) => ({ count: result?.views }));
  }

  @Patch('/:id/views')
  @HttpCode(HttpStatus.CREATED)
  updateViews(@Param('id') id: string) {
    return prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });
  }
}

export default createHandler(PostsHandler);
