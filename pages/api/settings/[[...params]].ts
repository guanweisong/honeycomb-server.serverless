import Setting from '@/server/setting/models/setting';
import {
  Body,
  createHandler,
  Get,
  HttpCode,
  Param,
  Patch,
  ValidationPipe,
} from 'next-api-decorators';
import DatabaseGuard from '@/middlewares/database.middlewar';
import SettingUpdateDto from '@/server/setting/dtos/setting.update.dto';
import { HttpStatus } from '@/types/HttpStatus';
import { UserLevel } from '@/server/user/types/UserLevel';
import Auth from '@/middlewares/auth.middlewar';

class SettingsHandler {
  @Get()
  @DatabaseGuard()
  async findAll() {
    return Setting.find();
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN])()
  async findByIdAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: SettingUpdateDto) {
    return Setting.findByIdAndUpdate(id, data);
  }
}

export default createHandler(SettingsHandler);
