import { PageStatus } from '@/server/page/types/PageStatus';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import PaginationType from '../../../types/PaginationType';

class PageListQueryDto extends PaginationType {
  @IsEnum(PageStatus)
  @IsOptional()
  @Type(() => String)
  public status: PageStatus;

  @MaxLength(20, { message: '页面作者名称最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public author: string;

  @MaxLength(20, { message: '关键词最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public keyword: string;
}

export default PageListQueryDto;
