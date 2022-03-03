import PaginationType from '../../../types/PaginationType';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

class TagListQueryDto extends PaginationType {
  @MaxLength(20, { message: '标签名称最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public tag_name: string;
}

export default TagListQueryDto;
