import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

class TagCreateDto {
  @MaxLength(20, { message: '标签名称最大长度不可超过20' })
  @IsNotEmpty({ message: '标签名称不可为空' })
  @IsString()
  public name: string;
}

export default TagCreateDto;
