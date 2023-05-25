import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { UserUpdateSchema } from '@/app/user/schemas/user.update.schema';
import { UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await validateAuth(request, [UserLevel.ADMIN]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const id = params.id;
  const data = await request.clone().json();
  const validate = UserUpdateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.user.update({ where: { id }, data: validate.data });
    return ResponseHandler.Update(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
