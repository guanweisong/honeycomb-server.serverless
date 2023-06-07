import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await prisma.setting.findFirst();
  return ResponseHandler.Query(result);
}
