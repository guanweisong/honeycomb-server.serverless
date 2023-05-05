import { UserLevel } from '@/server/user/types/UserLevel';
import { UserStatus } from '@/server/user/types/UserStatus';
import PaginationType from '@/types/PaginationType';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

class UserListQueryDto extends PaginationType {
  @MaxLength(20, { message: '用户名最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public name?: string;

  @MaxLength(20, { message: '邮箱最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public email?: string;

  @MaxLength(20, { message: '关键词最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public keyword?: string;

  @IsEnum(UserStatus, { each: true, message: '用户状态不合法' })
  @IsOptional()
  @Type(() => Array)
  public status?: UserStatus[];

  @IsEnum(UserLevel, { each: true, message: '用户角色不合法' })
  @IsOptional()
  @Type(() => Array)
  public level?: UserLevel[];
}

export default UserListQueryDto;
