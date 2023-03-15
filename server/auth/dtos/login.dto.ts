import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不可为空' })
  @Type(() => String)
  public name: string;

  @IsString()
  @IsNotEmpty({ message: '密码不可为空' })
  @Type(() => String)
  public password: string;
}

export default LoginDto;
