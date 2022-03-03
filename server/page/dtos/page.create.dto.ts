import { IsNotEmpty, MaxLength, IsString, IsMongoId, IsEnum } from 'class-validator';
import { PageStatus } from '@/server/page/types/PageStatus';

class PageCreateDto {
  @MaxLength(20, { message: '页面名称最大长度不可超过20' })
  @IsNotEmpty({ message: '页面名称不可为空' })
  @IsString()
  public page_title: string;

  @MaxLength(20000, { message: '页面内容最大长度不可超过20' })
  @IsNotEmpty({ message: '页面内容不可为空' })
  @IsString()
  public page_content: string;

  @IsMongoId()
  @IsNotEmpty({ message: '作者ID不可为空' })
  @IsString()
  public page_author: string;

  @IsEnum(PageStatus, { message: '页面状态值非法' })
  @IsNotEmpty({ message: '页面状态不可为空' })
  public page_status: number;
}

export default PageCreateDto;
