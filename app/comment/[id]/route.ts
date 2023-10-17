import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { NextRequest } from 'next/server';
import md5 from 'md5';
import { CommentStatus, UserLevel } from '.prisma/client';
// @ts-ignore
import listToTree from 'list-to-tree-lite';
import { CommentUpdateSchema } from '@/app/comment/schemas/comment.update.schema';
import { validateAuth } from '@/libs/validateAuth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const condition = {
    postId: id,
    status: { in: [CommentStatus.PUBLISH, CommentStatus.BAN] },
  };
  const result = await prisma.comment.findMany({
    where: condition,
    orderBy: { updatedAt: 'desc' },
  });
  const list =
    result.length > 0
      ? listToTree(
          result.map((item) => {
            return {
              ...item,
              id: item.id.toString(),
              avatar: `https://cravatar.cn/avatar/${md5(
                item.email.trim().toLowerCase(),
              )}?s=48&d=identicon`,
            };
          }),
          {
            idKey: 'id',
            parentKey: 'parentId',
          },
        )
      : [];
  const total = await prisma.comment.count({ where: condition });
  return ResponseHandler.Query({ list, total });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await validateAuth(request, [UserLevel.ADMIN]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const id = params.id;
  const data = await request.clone().json();
  const validate = CommentUpdateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.comment.update({ where: { id }, data: validate.data });
    return ResponseHandler.Update(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
