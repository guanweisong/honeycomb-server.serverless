import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import SettingUpdateDto from '@/server/setting/dtos/setting.update.dto';
import { UserLevel } from '@/server/user/types/UserLevel';
import { HttpStatus } from '@/types/HttpStatus';
import { cacheControl } from '@/utils/constants';
import {
  Body,
  createHandler,
  Get,
  HttpCode,
  Param,
  Patch,
  SetHeader,
  ValidationPipe,
} from 'next-api-decorators';

class SettingsHandler {
  @Get()
  @SetHeader('Cache-Control', cacheControl)
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
