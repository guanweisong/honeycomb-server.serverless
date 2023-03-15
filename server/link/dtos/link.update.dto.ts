import { EnableType } from '@/types/EnableType';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

class LinkUpdateDto {
  @MaxLength(20, { message: 'URL最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public url: string;

  @MaxLength(20, { message: '链接名称最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public name: string;

  @MaxLength(200, { message: '链接描述最大长度不可超过200' })
  @IsOptional()
  @IsString()
  public description: string;

  @IsEnum(EnableType, { message: '链接状态不合法' })
  @IsOptional()
  public status: EnableType;
}

export default LinkUpdateDto;
