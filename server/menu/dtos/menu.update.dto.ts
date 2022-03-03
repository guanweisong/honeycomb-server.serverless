import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsMongoId,
  IsEnum,
  IsOptional,
  IsInt,
} from 'class-validator';
import { MenuType } from '@/server/menu/types/MenuType';

class MenuUpdateDto {
  @MaxLength(20, { message: '标签名称最大长度不可超过20' })
  @IsNotEmpty({ message: '标签名称不可为空' })
  @IsString()
  public tag_name: string;

  @IsNotEmpty({ message: '菜单ID不可为空' })
  @IsMongoId()
  public _id: string;

  @IsNotEmpty({ message: '菜单类型不可为空' })
  @IsEnum(MenuType, { message: '菜单类型不合法' })
  public type: MenuType;

  @IsOptional()
  @IsMongoId()
  public parent: string;

  @MaxLength(100, { message: '菜单权重最大长度不可超过20' })
  @IsNotEmpty({ message: '菜单权重不可为空' })
  @IsInt()
  public power: number;
}

export default MenuUpdateDto;
