import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

class PaginationType {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public page: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public limit: number = 10;

  @IsOptional()
  @IsString()
  public sortField: string = 'createdAt';

  @IsOptional()
  @IsString()
  public sortOrder: string = 'desc';
}

export default PaginationType;
