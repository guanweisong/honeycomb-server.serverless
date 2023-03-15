import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import MenuUpdateDto from '@/server/menu/dtos/menu.update.dto';
import { MenuType } from '@/server/menu/types/MenuType';
import { UserLevel } from '@/server/user/types/UserLevel';
import { HttpStatus } from '@/types/HttpStatus';
import { Body, createHandler, Get, HttpCode, Patch, ValidationPipe } from 'next-api-decorators';

class MenusHandler {
  @Get()
  async findAll() {
    const list = await prisma.menu.findMany({
      orderBy: { power: 'asc' },
    });
    const categoryList = await prisma.category.findMany();
    const pageList = await prisma.page.findMany();
    list.forEach((m) => {
      if (m.type === MenuType.CATEGORY) {
        categoryList.forEach((n) => {
          if (m.id.toString() === n.id.toString()) {
            m.title = n.title;
            m.titleEn = n.titleEn;
            m.parent = n.parent;
          }
        });
      }
      if (m.type === MenuType.PAGE) {
        pageList.forEach((n) => {
          if (m.id.toString() === n.id.toString()) {
            m.title = n.title;
          }
        });
      }
    });
    return {
      list,
      total: await prisma.menu.count(),
    };
  }

  @Patch()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN])()
  async findOneAndUpdate(@Body(ValidationPipe) data: MenuUpdateDto[]) {
    await prisma.menu.deleteMany({});
    return prisma.menu.createMany({ data });
  }
}

export default createHandler(MenusHandler);
