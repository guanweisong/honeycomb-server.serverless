import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PaginationType {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public page: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public limit: number = 10;
}

export default PaginationType;
