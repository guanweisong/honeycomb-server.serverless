import { NextRequest } from 'next/server';
import ResponseHandler from '@/libs/responseHandler';
import { validateAuth } from '@/libs/validateAuth';
import { UserLevel } from '.prisma/client';

export async function GET(request: NextRequest) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR, UserLevel.GUEST]);
  if (!auth.isOk) {
    return ResponseHandler.Query({});
  } else {
    return ResponseHandler.Query(auth.data);
  }
}
