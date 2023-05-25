import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { NextRequest } from 'next/server';
const showdown = require('showdown');
import { PageUpdateSchema } from '@/app/page/schemas/page.update.schema';
import { UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';

const converter = new showdown.Converter();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const result = await prisma.page.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
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
  const validate = PageUpdateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.page.update({ where: { id }, data: validate.data });
    return ResponseHandler.Update(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
