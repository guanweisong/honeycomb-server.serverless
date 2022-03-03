import PaginationType from '../../../types/PaginationType';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PageStatus } from '@/server/page/types/PageStatus';

class PageListQueryDto extends PaginationType {
  @IsEnum(PageStatus)
  @IsOptional()
  @Type(() => Number)
  public page_status: PageStatus;

  @MaxLength(20, { message: '页面作者名称最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public page_author: string;

  @MaxLength(20, { message: '关键词最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public keyword: string;
}

export default PageListQueryDto;
