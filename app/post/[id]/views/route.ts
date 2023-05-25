import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const result = await prisma.post
    .findUnique({ where: { id } })
    .then((result) => ({ count: result?.views }));
  return ResponseHandler.Query(result);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const result = await prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });
  return ResponseHandler.Update(result);
}
