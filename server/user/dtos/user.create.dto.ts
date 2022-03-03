import { IsEnum, IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus } from '@/server/user/types/UserStatus';
import { UserLevel } from '@/server/user/types/UserLevel';

class UserCreateDto {
  @MaxLength(20, { message: '用户名最大长度不可超过20' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  @Type(() => String)
  public user_name: string;

  @MaxLength(20, { message: '邮箱最大长度不可超过20' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsString()
  @Type(() => String)
  public user_email: string;

  @IsEnum(UserStatus, { each: true, message: '用户状态不合法' })
  @IsNotEmpty({ message: '用户状态不能为空' })
  @Type(() => Number)
  public user_status: UserStatus;

  @IsEnum(UserLevel, { each: true, message: '用户角色不合法' })
  @IsNotEmpty({ message: '用户角色不能为空' })
  @Type(() => Number)
  public user_level: UserLevel;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Type(() => String)
  public user_password: string;
}

export default UserCreateDto;
