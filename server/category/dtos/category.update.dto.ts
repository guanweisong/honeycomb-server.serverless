import { EnableType } from '@/types/EnableType';
import { IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

class CategoryUpdateDto {
  @MaxLength(20, { message: '分类名称最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public title: string;

  @MaxLength(20, { message: '分类英文名称最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public titleEn: string;

  @IsOptional()
  @IsMongoId()
  public parent: string;

  @IsOptional()
  @MaxLength(200, { message: '分类描述最大长度不可超过200' })
  @IsString()
  public description: string;

  @IsOptional()
  @IsEnum(EnableType, { message: '分类状态不合法' })
  public status: EnableType;
}

export default CategoryUpdateDto;
