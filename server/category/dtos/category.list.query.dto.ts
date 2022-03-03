import PaginationType from '../../../types/PaginationType';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class CategoryListQueryDto extends PaginationType {
  @IsString()
  @IsOptional()
  @Type(() => String)
  public id: string;
}

export default CategoryListQueryDto;
