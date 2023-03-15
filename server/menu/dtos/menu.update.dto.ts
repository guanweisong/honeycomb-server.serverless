import { MenuType } from '@/server/menu/types/MenuType';
import { IsEnum, IsInt, IsMongoId, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

class MenuUpdateDto {
  @IsNotEmpty({ message: '菜单ID不可为空' })
  @IsMongoId()
  public id: string;

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
