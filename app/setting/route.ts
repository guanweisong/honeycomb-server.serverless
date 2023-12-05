import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { errorHandle } from '@/libs/errorHandle';

export const dynamic = 'force-dynamic';

export async function GET() {
  return errorHandle(async () => {
    const result = await prisma.setting.findFirst();
    return ResponseHandler.Query(result);
  });
}
