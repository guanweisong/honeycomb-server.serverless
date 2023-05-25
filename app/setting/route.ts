import prisma from '@/libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await prisma.setting.findFirst();
  return NextResponse.json(result);
}
