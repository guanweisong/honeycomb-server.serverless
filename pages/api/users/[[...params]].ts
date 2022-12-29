import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Post,
  Query,
  ValidationPipe,
  createHandler,
} from 'next-api-decorators';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import DatabaseGuard from '@/middlewares/database.middlewar';
import Tools from '@/utils/tools';
import User from '@/server/user/models/user';
import UserListQueryDto from '@/server/user/dtos/user.list.query.dto';
import { HttpStatus } from '@/types/HttpStatus';
import UserCreateDto from '@/server/user/dtos/user.create.dto';
import DeleteParamsDto from '@/dtos/delete.params.dto';
import UserUpdateDto from '@/server/user/dtos/user.update.dto';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';

class UsersHandler {
  @Get()
  @ParseQueryGuard()
  @DatabaseGuard()
  async findAll(
    @Query(ValidationPipe)
    query: UserListQueryDto,
  ) {
    const { page, limit, ...rest } = query;
    const conditions = Tools.getFindConditionsByQueries(rest, [
      'user_level',
      'user_status',
      'user_name',
      'user_email',
      '_id',
    ]);
    const list = await User.find(conditions, { user_password: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updated_at: -1 })
      .lean();
    const total = await User.count(conditions);
    return {
      list,
      total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@Body(ValidationPipe) data: UserCreateDto) {
    const model = new User(data);
    return model.save();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    return User.deleteMany({ _id: { $in: query.ids } });
  }

  @Put('/:id')
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async findOneAndUpdate(@Param('id') id: string, @Body(ValidationPipe) data: UserUpdateDto) {
    return User.findByIdAndUpdate(id, data);
  }
}

export default createHandler(UsersHandler);
