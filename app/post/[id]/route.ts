import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { NextRequest } from 'next/server';
const showdown = require('showdown');
import { PostUpdateSchema } from '@/app/post/schemas/post.update.schema';
import { UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';

const converter = new showdown.Converter();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
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
    result.content = converter.makeHtml(result.content);
  }
  return ResponseHandler.Query(result);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const id = params.id;
  const data = await request.clone().json();
  const validate = PostUpdateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.post.update({ where: { id }, data: validate.data });
    return ResponseHandler.Update(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
