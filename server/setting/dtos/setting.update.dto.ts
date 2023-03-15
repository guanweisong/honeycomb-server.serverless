import { Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

class SettingUpdateDto {
  @MaxLength(50, { message: '网站名称最大长度不可超过50' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public siteName: string;

  @MaxLength(100, { message: '网站副标题最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public siteSubName: string;

  @MaxLength(100, { message: '网站签名最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public siteSignature: string;

  @MaxLength(100, { message: '版权信息最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public siteCopyright: string;

  @MaxLength(100, { message: '备案号最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public siteRecordNo: string;

  @MaxLength(100, { message: '工信部网址最大长度不可超过100' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  public siteRecordUrl: string;
}

export default SettingUpdateDto;
