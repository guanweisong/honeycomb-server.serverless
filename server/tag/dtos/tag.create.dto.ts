import { IsNotEmpty, MaxLength, IsString } from 'class-validator';

class TagCreateDto {
  @MaxLength(20, { message: '标签名称最大长度不可超过20' })
  @IsNotEmpty({ message: '标签名称不可为空' })
  @IsString()
  public tag_name: string;
}

export default TagCreateDto;
