import { NextRequest } from 'next/server';
import Tools from '@/libs/tools';
import { LinkListQuerySchema } from '@/app/link/schemas/link.list.query.schema';
import ResponseHandler from '@/libs/responseHandler';
import prisma from '@/libs/prisma';
import { LinkCreateSchema } from '@/app/link/schemas/link.create.schema';
import { DeleteBatchSchema } from '@/schemas/delete.batch.schema';
import { UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';
import { getQueryParams } from '@/libs/getQueryParams';

export async function GET(request: NextRequest) {
  const validate = LinkListQuerySchema.safeParse(getQueryParams(request));
  if (validate.success) {
    const { page, limit, sortField, sortOrder, ...rest } = validate.data;
    const conditions = Tools.getFindConditionsByQueries(rest, ['status']);
    const list = await prisma.link.findMany({
      where: conditions,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.link.count({ where: conditions });
    const result = { list, total };
    return ResponseHandler.Query(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await validateAuth(request, [UserLevel.ADMIN]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const data = await request.clone().json();
  const validate = LinkCreateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.link.create({ data: validate.data });
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
    const result = await prisma.link.deleteMany({ where: { id: { in: validate.data.ids } } });
    return ResponseHandler.Delete();
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
