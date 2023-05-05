import { Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import PaginationType from '../../../types/PaginationType';

class TagListQueryDto extends PaginationType {
  @MaxLength(20, { message: '标签名称最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public name: string;
}

export default TagListQueryDto;
