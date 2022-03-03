import { IsOptional, IsEnum, MaxLength, IsString } from 'class-validator';
import { EnableType } from '@/types/EnableType';

class LinkUpdateDto {
  @MaxLength(20, { message: 'URL最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public link_url: string;

  @MaxLength(20, { message: '链接名称最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public link_name: string;

  @MaxLength(200, { message: '链接描述最大长度不可超过200' })
  @IsOptional()
  @IsString()
  public link_description: string;

  @IsEnum(EnableType, { message: '链接状态不合法' })
  @IsOptional()
  public link_status: EnableType;
}

export default LinkUpdateDto;
