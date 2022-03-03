import PaginationType from '../../../types/PaginationType';
import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

class TokenListQueryDto extends PaginationType {
  @IsMongoId()
  @IsOptional()
  @Type(() => String)
  public user_id: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  public token_content: string;
}

export default TokenListQueryDto;
