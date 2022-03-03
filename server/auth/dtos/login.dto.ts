import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不可为空' })
  @Type(() => String)
  public user_name: string;

  @IsString()
  @IsNotEmpty({ message: '密码不可为空' })
  @Type(() => String)
  public user_password: string;
}

export default LoginDto;
