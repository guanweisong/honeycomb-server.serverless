import { PageStatus } from '@/server/page/types/PageStatus';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

class PageCreateDto {
  @MaxLength(20, { message: '页面名称最大长度不可超过20' })
  @IsNotEmpty({ message: '页面名称不可为空' })
  @IsString()
  public title: string;

  @MaxLength(20000, { message: '页面内容最大长度不可超过20' })
  @IsNotEmpty({ message: '页面内容不可为空' })
  @IsString()
  public content: string;

  @IsMongoId()
  @IsNotEmpty({ message: '作者ID不可为空' })
  @IsString()
  public authorId: string;

  @IsEnum(PageStatus, { message: '页面状态值非法' })
  @IsOptional()
  public status: PageStatus;
}

export default PageCreateDto;
