import UserCreateDto from '@/server/user/dtos/user.create.dto';
import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus } from '@/server/user/types/UserStatus';
import { UserLevel } from '@/server/user/types/UserLevel';

class UserUpdateDto extends UserCreateDto {
  @MaxLength(20, { message: '用户名最大长度不可超过20' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public user_name: string;

  @MaxLength(20, { message: '邮箱最大长度不可超过20' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public user_email: string;

  @IsEnum(UserStatus, { each: true, message: '用户状态不合法' })
  @IsOptional()
  @Type(() => Number)
  public user_status: UserStatus;

  @IsEnum(UserLevel, { each: true, message: '用户角色不合法' })
  @IsOptional()
  @Type(() => Number)
  public user_level: UserLevel;

  @IsString()
  @IsOptional()
  @Type(() => String)
  public user_password: string;
}

export default UserUpdateDto;
