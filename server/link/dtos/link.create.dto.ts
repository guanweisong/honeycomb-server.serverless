import { IsNotEmpty, IsEnum, MaxLength, IsString } from 'class-validator';
import { EnableType } from '@/types/EnableType';

class LinkCreateDto {
  @MaxLength(20, { message: 'URL最大长度不可超过20' })
  @IsNotEmpty({ message: 'URL不可为空' })
  @IsString()
  public link_url: string;

  @MaxLength(20, { message: '链接名称最大长度不可超过20' })
  @IsNotEmpty({ message: '链接名称不可为空' })
  @IsString()
  public link_name: string;

  @MaxLength(200, { message: '链接描述最大长度不可超过200' })
  @IsNotEmpty({ message: '链接描述不可为空' })
  @IsString()
  public link_description: string;

  @IsEnum(EnableType, { message: '链接状态不合法' })
  public link_status: EnableType = EnableType.ENABLE;
}

export default LinkCreateDto;
