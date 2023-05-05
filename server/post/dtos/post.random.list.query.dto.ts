import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

class PostRandomListQueryDto {
  @IsNumber()
  @Type(() => Number)
  public number: number;
}

export default PostRandomListQueryDto;
