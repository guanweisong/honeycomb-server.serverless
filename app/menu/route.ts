import { NextRequest } from 'next/server';
import ResponseHandler from '@/libs/responseHandler';
import prisma from '@/libs/prisma';
import { MenuUpdateSchema } from '@/app/menu/schemas/menu.update.schema';
import { MenuType, UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';

export async function GET(request: NextRequest) {
  const list = await prisma.menu.findMany({
    orderBy: { power: 'asc' },
  });
  const categoryList = await prisma.category.findMany();
  const pageList = await prisma.page.findMany();
  list.forEach((m) => {
    if (m.type === MenuType.CATEGORY) {
      categoryList.forEach((n) => {
        if (m.id.toString() === n.id.toString()) {
          // @ts-ignore
          m.title = n.title;
          // @ts-ignore
          m.titleEn = n.titleEn;
          m.parent = n.parent;
        }
      });
    }
    if (m.type === MenuType.PAGE) {
      pageList.forEach((n) => {
        if (m.id.toString() === n.id.toString()) {
          // @ts-ignore
          m.title = n.title;
        }
      });
    }
  });
  const total = await prisma.menu.count();
  return ResponseHandler.Query({ list, total });
}

export async function PATCH(request: NextRequest) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const data = await request.clone().json();
  const validate = MenuUpdateSchema.safeParse(data);
  if (validate.success) {
    await prisma.menu.deleteMany({});
    const result = await prisma.menu.createMany({ data });
    return ResponseHandler.Create(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
