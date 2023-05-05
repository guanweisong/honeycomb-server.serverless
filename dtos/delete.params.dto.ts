import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';
import 'reflect-metadata';

class DeleteParamsDto {
  @IsArray({ message: 'ids必须为数组' })
  @IsNotEmpty({ message: 'ids不可以为空' })
  @Type(() => String)
  public ids: string[];
}

export default DeleteParamsDto;
