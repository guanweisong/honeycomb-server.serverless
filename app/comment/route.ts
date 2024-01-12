import { NextRequest } from 'next/server';
import { Resend } from 'resend';
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
import CommentEmailMessage from '@/app/components/CommentEmailMessage';

const resend = new Resend(process.env.RESEND_API_KEY);

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
            ip: request.headers.get('X-Forwarded-For'),
            status: CommentStatus.PUBLISH,
            userAgent: request.headers.get('user-agent')!,
          },
        });
        // 通知管理员
        resend.emails
          .send({
            from: 'notice@guanweisong.com',
            to: '307761682@qq.com',
            subject: '您有一条新的评论',
            react: CommentEmailMessage({ message: rest.content, author: rest.author }),
          })
          .then((e) => {
            console.log('SendEmail Success', e);
          })
          .catch((e) => {
            console.log('SendEmail Error', e);
          });
        // 通知被评论人
        if (rest.parentId) {
          const parentComment = await prisma.comment.findUnique({ where: { id: rest.parentId } });
          if (parentComment) {
            resend.emails
              .send({
                from: 'notice@guanweisong.com',
                to: parentComment.email,
                subject: '您有一条新的评论回复来自于稻草人博客',
                react: CommentEmailMessage({ message: rest.content, author: rest.author }),
              })
              .then((e) => {
                console.log('SendEmail Success', e);
              })
              .catch((e) => {
                console.log('SendEmail Error', e);
              });
          }
        }
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
