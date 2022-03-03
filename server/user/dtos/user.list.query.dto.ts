import PaginationType from '@/types/PaginationType';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus } from '@/server/user/types/UserStatus';
import { UserLevel } from '@/server/user/types/UserLevel';

class UserListQueryDto extends PaginationType {
  @MaxLength(20, { message: '用户名最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public user_name?: string;

  @MaxLength(20, { message: '邮箱最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public user_email?: string;

  @MaxLength(20, { message: '关键词最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public keyword?: string;

  @IsEnum(UserStatus, { each: true, message: '用户状态不合法' })
  @IsOptional()
  @Type(() => Array)
  public user_status?: UserStatus[];

  @IsEnum(UserLevel, { each: true, message: '用户角色不合法' })
  @IsOptional()
  @Type(() => Array)
  public user_level?: UserLevel[];
}

export default UserListQueryDto;
