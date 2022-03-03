import { IsNotEmpty, MaxLength, IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { EnableType } from '@/types/EnableType';

class CategoryCreateDto {
  @MaxLength(20, { message: '分类名称最大长度不可超过20' })
  @IsNotEmpty({ message: '分类名称不可为空' })
  @IsString()
  public category_title: string;

  @MaxLength(20, { message: '分类英文名称最大长度不可超过20' })
  @IsNotEmpty({ message: '分类英文名称不可为空' })
  @IsString()
  public category_title_en: string;

  @IsOptional()
  @IsMongoId()
  public category_parent: string;

  @IsOptional()
  @MaxLength(200, { message: '分类描述最大长度不可超过200' })
  @IsString()
  public category_description: string;

  @IsNotEmpty({ message: '分类状态不可为空' })
  @IsEnum(EnableType, { message: '分类状态不合法' })
  public category_status: EnableType;
}

export default CategoryCreateDto;
