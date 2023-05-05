import UserCreateDto from '@/server/user/dtos/user.create.dto';
import { UserLevel } from '@/server/user/types/UserLevel';
import { UserStatus } from '@/server/user/types/UserStatus';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

class UserUpdateDto extends UserCreateDto {
  @MaxLength(20, { message: '用户名最大长度不可超过20' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public name: string;

  @MaxLength(20, { message: '邮箱最大长度不可超过20' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public email: string;

  @IsEnum(UserStatus, { each: true, message: '用户状态不合法' })
  @IsOptional()
  @Type(() => String)
  public status: UserStatus;

  @IsEnum(UserLevel, { each: true, message: '用户角色不合法' })
  @IsOptional()
  @Type(() => String)
  public level: UserLevel;

  @IsString()
  @IsOptional()
  @Type(() => String)
  public password: string;
}

export default UserUpdateDto;
