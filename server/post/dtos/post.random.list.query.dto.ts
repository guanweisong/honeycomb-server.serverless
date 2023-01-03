import * as mongoose from 'mongoose';
import { IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

class PostRandomListQueryDto {
  @IsNumber()
  @Type(() => Number)
  public number: number;
}

export default PostRandomListQueryDto;
