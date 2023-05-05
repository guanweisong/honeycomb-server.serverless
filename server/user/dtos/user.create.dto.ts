import { UserLevel } from '@/server/user/types/UserLevel';
import { UserStatus } from '@/server/user/types/UserStatus';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

class UserCreateDto {
  @MaxLength(20, { message: '用户名最大长度不可超过20' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  @Type(() => String)
  public name: string;

  @MaxLength(20, { message: '邮箱最大长度不可超过20' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsString()
  @Type(() => String)
  public email: string;

  @IsEnum(UserStatus, { each: true, message: '用户状态不合法' })
  @IsNotEmpty({ message: '用户状态不能为空' })
  @Type(() => String)
  public status: UserStatus;

  @IsEnum(UserLevel, { each: true, message: '用户角色不合法' })
  @IsNotEmpty({ message: '用户角色不能为空' })
  @Type(() => String)
  public level: UserLevel;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Type(() => String)
  public password: string;
}

export default UserCreateDto;
