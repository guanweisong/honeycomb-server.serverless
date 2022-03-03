import { MaxLength, IsString, IsMongoId, IsEnum, IsOptional } from 'class-validator';
import { PageStatus } from '@/server/page/types/PageStatus';

class PageUpdateDto {
  @MaxLength(20, { message: '页面名称最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public page_title: string;

  @MaxLength(20000, { message: '页面内容最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public page_content: string;

  @IsMongoId()
  @IsOptional()
  @IsString()
  public page_author: string;

  @IsEnum(PageStatus, { message: '页面状态值非法' })
  @IsOptional()
  public page_status: number;
}

export default PageUpdateDto;
