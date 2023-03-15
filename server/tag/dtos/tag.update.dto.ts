import { IsOptional, IsString, MaxLength } from 'class-validator';

class TagUpdateDto {
  @MaxLength(20, { message: '标签名称最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public name: string;
}

export default TagUpdateDto;
