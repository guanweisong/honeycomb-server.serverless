import PaginationType from '../../../types/PaginationType';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EnableType } from '@/types/EnableType';
import { Type } from 'class-transformer';

class LinkListQueryDto extends PaginationType {
  @MaxLength(20, { message: '链接名称最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public link_name: string;

  @MaxLength(20, { message: 'URL最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public link_url?: string;

  @IsOptional()
  @IsEnum(EnableType, { each: true, message: '链接状态不合法' })
  @Type(() => Array)
  public link_status?: EnableType[];

  @MaxLength(20, { message: '关键词最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public keyword?: string;
}

export default LinkListQueryDto;
