import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { NextRequest } from 'next/server';
import md5 from 'md5';
import { CommentStatus, UserLevel } from '.prisma/client';
// @ts-ignore
import listToTree from 'list-to-tree-lite';
import { CommentUpdateSchema } from '@/app/comment/schemas/comment.update.schema';
import { validateAuth } from '@/libs/validateAuth';
import { validateParams } from '@/libs/validateParams';
import { errorHandle } from '@/libs/errorHandle';

export async function GET(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  return errorHandle(async () => {
    const condition = {
      postId: id,
      status: { in: [CommentStatus.PUBLISH, CommentStatus.BAN] },
    };
    const result = await prisma.comment.findMany({
      where: condition,
      orderBy: { createdAt: 'asc' },
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
  });
}

export async function PATCH(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  return validateAuth(request, [UserLevel.ADMIN], async () => {
    const params = await request.clone().json();
    return validateParams(CommentUpdateSchema, params, async (data) => {
      return errorHandle(async () => {
        const result = await prisma.comment.update({ where: { id }, data });
        return ResponseHandler.Update(result);
      });
    });
  });
}
