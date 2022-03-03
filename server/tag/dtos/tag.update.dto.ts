import { IsOptional, MaxLength, IsString } from 'class-validator';

class TagUpdateDto {
  @MaxLength(20, { message: '标签名称最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public tag_name: string;
}

export default TagUpdateDto;
