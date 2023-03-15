import { EnableType } from '@/types/EnableType';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

class CategoryCreateDto {
  @MaxLength(20, { message: '分类名称最大长度不可超过20' })
  @IsNotEmpty({ message: '分类名称不可为空' })
  @IsString()
  public title: string;

  @MaxLength(20, { message: '分类英文名称最大长度不可超过20' })
  @IsNotEmpty({ message: '分类英文名称不可为空' })
  @IsString()
  public titleEn: string;

  @IsOptional()
  @IsMongoId()
  public parent: string;

  @IsOptional()
  @MaxLength(200, { message: '分类描述最大长度不可超过200' })
  @IsString()
  public description: string;

  @IsNotEmpty({ message: '分类状态不可为空' })
  @IsEnum(EnableType, { message: '分类状态不合法' })
  public status: EnableType;
}

export default CategoryCreateDto;
