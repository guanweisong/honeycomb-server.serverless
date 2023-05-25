import { NextRequest } from 'next/server';
import Tools from '@/libs/tools';
import ResponseHandler from '@/libs/responseHandler';
import prisma from '@/libs/prisma';
import { DeleteBatchSchema } from '@/schemas/delete.batch.schema';
import { PostListQuerySchema } from '@/app/post/schemas/post.list.query.schema';
import { PostCreateSchema } from '@/app/post/schemas/post.create.schema';
import { UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';
import { getQueryParams } from '@/libs/getQueryParams';

export async function GET(request: NextRequest) {
  const validate = PostListQuerySchema.safeParse(getQueryParams(request));
  if (validate.success) {
    const { page, limit, sortField, sortOrder, categoryId, tagName, userName, ...rest } =
      validate.data;
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
    const result = {
      list: list.map((item) => {
        const { content, ...rest } = item;
        return rest;
      }),
      total,
    };
    return ResponseHandler.Query(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const data = await request.clone().json();
  const validate = PostCreateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.post.create({
      data: { ...validate.data, authorId: auth.data!.id },
    });
    return ResponseHandler.Create(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const validate = DeleteBatchSchema.safeParse(getQueryParams(request));
  if (validate.success) {
    const result = await prisma.post.deleteMany({ where: { id: { in: validate.data.ids } } });
    return ResponseHandler.Delete();
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
