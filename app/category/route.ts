import { NextRequest } from 'next/server';
import Tools from '@/libs/tools';
import ResponseHandler from '@/libs/responseHandler';
import prisma from '@/libs/prisma';
import { DeleteBatchSchema } from '@/schemas/delete.batch.schema';
import { CategoryListQuerySchema } from '@/app/category/schemas/category.list.query.schema';
import { CategoryCreateSchema } from '@/app/category/schemas/category.create.schema';
import { UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';
import { getQueryParams } from '@/libs/getQueryParams';

export async function GET(request: NextRequest) {
  const validate = CategoryListQuerySchema.safeParse(getQueryParams(request));
  if (validate.success) {
    const { id, page, limit, sortField, sortOrder, ...rest } = validate.data;
    const conditions = Tools.getFindConditionsByQueries(rest, ['status']);
    const list = await prisma.category.findMany({
      where: conditions,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.category.count({ where: conditions });
    const result = { list: Tools.sonsTree(list, id), total };
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
  const validate = CategoryCreateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.category.create({ data: validate.data });
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
    const result = await prisma.category.deleteMany({ where: { id: { in: validate.data.ids } } });
    return ResponseHandler.Delete();
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
