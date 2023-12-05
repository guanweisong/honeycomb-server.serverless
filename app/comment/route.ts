import { NextRequest } from 'next/server';
import Tools from '@/libs/tools';
import ResponseHandler from '@/libs/responseHandler';
import prisma from '@/libs/prisma';
import { DeleteBatchSchema } from '@/schemas/delete.batch.schema';
import { CommentListQuerySchema } from '@/app/comment/schemas/comment.list.query.schema';
import { CommentCreateSchema } from '@/app/comment/schemas/commnet.create.schema';
import { CommentStatus, UserLevel } from '.prisma/client';
import { getQueryParams } from '@/libs/getQueryParams';
import { validateParams } from '@/libs/validateParams';
import { validateAuth } from '@/libs/validateAuth';
import { validateCaptcha } from '@/libs/validateCaptcha';
import { errorHandle } from '@/libs/errorHandle';

export async function GET(request: NextRequest) {
  // @ts-ignore
  return validateParams(CommentListQuerySchema, getQueryParams(request), async (data) => {
    return errorHandle(async () => {
      const { page, limit, sortField, sortOrder, ...rest } = data;
      const conditions = Tools.getFindConditionsByQueries(rest, ['status']);
      const list = await prisma.comment.findMany({
        where: conditions,
        orderBy: { [sortField]: sortOrder },
        take: limit,
        skip: (page - 1) * limit,
      });
      const total = await prisma.comment.count({ where: conditions });
      const result = { list, total };
      return ResponseHandler.Query(result);
    });
  });
}

export async function POST(request: NextRequest) {
  return validateCaptcha(request, async () => {
    const params = await request.clone().json();
    return validateParams(CommentCreateSchema, params, async (data) => {
      return errorHandle(async () => {
        const { captcha, ...rest } = data;
        const result = await prisma.comment.create({
          data: {
            ...rest,
            ip: request.ip || '127.0.0.1',
            status: CommentStatus.PUBLISH,
            userAgent: request.headers.get('user-agent')!,
          },
        });
        return ResponseHandler.Create(result);
      });
    });
  });
}

export async function DELETE(request: NextRequest) {
  return validateAuth(request, [UserLevel.ADMIN], async () => {
    return validateParams(DeleteBatchSchema, getQueryParams(request), async (data) => {
      return errorHandle(async () => {
        const result = await prisma.comment.deleteMany({ where: { id: { in: data.ids } } });
        return ResponseHandler.Delete();
      });
    });
  });
}
