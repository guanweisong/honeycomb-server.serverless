import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import SettingUpdateDto from '@/server/setting/dtos/setting.update.dto';
import { UserLevel } from '@/server/user/types/UserLevel';
import { HttpStatus } from '@/types/HttpStatus';
import {
  Body,
  createHandler,
  Get,
  HttpCode,
  Param,
  Patch,
  ValidationPipe,
} from 'next-api-decorators';

class SettingsHandler {
  @Get()
  async findAll() {
    return prisma.setting.findFirst();
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN])()
  async findByIdAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: SettingUpdateDto) {
    return prisma.setting.update({ where: { id }, data });
  }
}

export default createHandler(SettingsHandler);
