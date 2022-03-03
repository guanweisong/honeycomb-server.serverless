import { IsNotEmpty, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class DeleteParamsDto {
  @IsArray({ message: 'ids必须为数组' })
  @IsNotEmpty({ message: 'ids不可以为空' })
  @Type(() => String)
  public ids: string[];
}

export default DeleteParamsDto;
