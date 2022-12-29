import {
  createHandler,
  ValidationPipe,
  Get,
  Patch,
  Body,
  HttpCode,
} from 'next-api-decorators';
import Menu from '@/server/menu/models/menu';
import DatabaseGuard from '@/middlewares/database.middlewar';
import { HttpStatus } from '@/types/HttpStatus';
import Page from '@/server/page/models/page';
import Category from '@/server/category/models/category';
import { MenuType } from '@/server/menu/types/MenuType';
import MenuUpdateDto from '@/server/menu/dtos/menu.update.dto';
import { UserLevel } from '@/server/user/types/UserLevel';
import Auth from '@/middlewares/auth.middlewar';

class MenusHandler {
  @Get()
  @DatabaseGuard()
  async findAll() {
    const list = await Menu.find().sort({ power: 1 }).lean();
    const categoryList = await Category.find().lean();
    const pageList = await Page.find().lean();
    list.forEach((m) => {
      if (m.type === MenuType.CATEGORY) {
        categoryList.forEach((n) => {
          if (m._id.toString() === n._id.toString()) {
            m.category_title = n.category_title;
            m.category_title_en = n.category_title_en;
            m.category_parent = n.category_parent;
          }
        });
      }
      if (m.type === MenuType.PAGE) {
        pageList.forEach((n) => {
          if (m._id.toString() === n._id.toString()) {
            m.page_title = n.page_title;
          }
        });
      }
    });
    return {
      list,
      total: await Menu.count(),
    };
  }

  @Patch()
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN])()
  async findOneAndUpdate(@Body(ValidationPipe) data: MenuUpdateDto[]) {
    await Menu.deleteMany();
    return Menu.insertMany(data);
  }
}

export default createHandler(MenusHandler);
