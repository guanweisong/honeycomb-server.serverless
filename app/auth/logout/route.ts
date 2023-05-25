import { NextRequest } from 'next/server';
import ResponseHandler from '@/libs/responseHandler';
import prisma from '@/libs/prisma';
import { getAuthToken } from '@/libs/getAuthToken';

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  if (token) {
    await prisma.token.delete({ where: { content: token } });
  }
  return ResponseHandler.Create({ isOk: true });
}
