import { PageStatus } from '@/server/page/types/PageStatus';
import { IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

class PageUpdateDto {
  @MaxLength(20, { message: '页面名称最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public title: string;

  @MaxLength(20000, { message: '页面内容最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public content: string;

  @IsMongoId()
  @IsOptional()
  @IsString()
  public authorId: string;

  @IsEnum(PageStatus, { message: '页面状态值非法' })
  @IsOptional()
  public status: PageStatus;
}

export default PageUpdateDto;
