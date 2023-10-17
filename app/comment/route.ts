import { NextRequest } from 'next/server';
import Tools from '@/libs/tools';
import ResponseHandler from '@/libs/responseHandler';
import prisma from '@/libs/prisma';
import { DeleteBatchSchema } from '@/schemas/delete.batch.schema';
import { CommentListQuerySchema } from '@/app/comment/schemas/comment.list.query.schema';
import { CommentCreateSchema } from '@/app/comment/schemas/commnet.create.schema';
import { CommentStatus, UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';
import { validateCaptcha } from '@/libs/validateCaptcha';
import { getQueryParams } from '@/libs/getQueryParams';

export async function GET(request: NextRequest) {
  const validate = CommentListQuerySchema.safeParse(getQueryParams(request));
  if (validate.success) {
    const { page, limit, sortField, sortOrder, ...rest } = validate.data;
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
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}

export async function POST(request: NextRequest) {
  const captchaValidate = await validateCaptcha(request);
  if (!captchaValidate.isOk) {
    return ResponseHandler.Forbidden({ message: captchaValidate.message });
  }
  const data = await request.clone().json();
  const validate = CommentCreateSchema.safeParse(data);
  if (validate.success) {
    const { captcha, ...rest } = validate.data;
    const result = await prisma.comment.create({
      data: {
        ...rest,
        ip: request.ip || '127.0.0.1',
        status: CommentStatus.PUBLISH,
        userAgent: request.headers.get('user-agent')!,
      },
    });
    return ResponseHandler.Create(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateAuth(request, [UserLevel.ADMIN]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const validate = DeleteBatchSchema.safeParse(getQueryParams(request));
  if (validate.success) {
    const result = await prisma.comment.deleteMany({ where: { id: { in: validate.data.ids } } });
    return ResponseHandler.Delete();
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
