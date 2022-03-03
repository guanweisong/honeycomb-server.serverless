import { IsNotEmpty, MaxLength, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class SettingUpdateDto {
  @MaxLength(50, { message: '网站名称最大长度不可超过50' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public site_name: string;

  @MaxLength(100, { message: '网站副标题最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public site_subName: string;

  @MaxLength(100, { message: '网站签名最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public site_signature: string;

  @MaxLength(100, { message: '版权信息最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public site_copyright: string;

  @MaxLength(100, { message: '备案号最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public site_record_no: string;

  @MaxLength(100, { message: '工信部网址最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public site_record_url: string;
}

export default SettingUpdateDto;
