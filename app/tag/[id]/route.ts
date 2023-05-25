import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { NextRequest } from 'next/server';
import { TagUpdateSchema } from '@/app/tag/schemas/tag.update.schema';
import { UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const id = params.id;
  const data = await request.clone().json();
  const validate = TagUpdateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.tag.update({ where: { id }, data: validate.data });
    return ResponseHandler.Update(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
