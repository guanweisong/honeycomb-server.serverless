import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';

export async function GET() {
  const result = await prisma.setting.findFirst();
  return ResponseHandler.Query(result);
}
