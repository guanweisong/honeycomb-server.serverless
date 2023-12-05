import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { errorHandle } from '@/libs/errorHandle';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return errorHandle(async () => {
    const { id } = params;
    const allIds = await prisma.post
      .findMany({ where: { categoryId: id }, select: { id: true } })
      .then((result) => result.map((item) => item.id));
    const randomArr = (arr: string[], num: number) => {
      let newArr = [];
      for (let i = 0; i < num; i++) {
        let temp = Math.floor(Math.random() * arr.length);
        newArr.push(arr[temp]);
        arr.splice(temp, 1);
      }
      return newArr;
    };
    const randomIds = randomArr(allIds, 10);
    const result = await prisma.post.findMany({
      where: { id: { in: randomIds } },
      select: {
        title: true,
        quoteContent: true,
        id: true,
      },
    });
    return ResponseHandler.Query(result);
  });
}
