import prisma from '@/libs/prisma';
import Tools from '@/libs/tools';
import { NextRequest } from 'next/server';
import { UserLevel, UserStatus } from '.prisma/client';
import { UserListQuerySchema } from '@/app/user/schemas/user.list.query.schema';
import ResponseHandler from '@/libs/responseHandler';
import { UserCreateSchema } from '@/app/user/schemas/user.create.schema';
import { DeleteBatchSchema } from '@/schemas/delete.batch.schema';
import { validateAuth } from '@/libs/validateAuth';
import { getQueryParams } from '@/libs/getQueryParams';

export async function GET(request: NextRequest) {
  const validate = UserListQuerySchema.safeParse(getQueryParams(request));
  if (validate.success) {
    const params = validate.data;
    const { page, limit, sortField, sortOrder, ...rest } = params;
    const conditions = Tools.getFindConditionsByQueries(rest, ['level', 'status']);
    const list = await prisma.user.findMany({
      where: conditions,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.user.count({ where: conditions });
    const result = {
      list: list.map((item) => {
        const { password, ...rest } = item;
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
  const auth = await validateAuth(request, [UserLevel.ADMIN]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const data = await request.clone().json();
  const validate = UserCreateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.user.create({ data: validate.data });
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
    const result = await prisma.user.updateMany({
      where: { id: { in: validate.data.ids } },
      data: { status: UserStatus.DELETED },
    });
    return ResponseHandler.Delete();
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
