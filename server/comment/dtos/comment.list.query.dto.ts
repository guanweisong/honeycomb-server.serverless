import { CommentStatus } from '@/server/comment/types/commentStatus';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import PaginationType from '../../../types/PaginationType';

class CommentListQueryDto extends PaginationType {
  @MaxLength(200, { message: '评论内容最大长度不可超过200' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public content: string;

  @IsOptional()
  @IsEnum(CommentStatus, { each: true, message: '评论状态不合法' })
  @Type(() => Array)
  public status?: CommentStatus[];
}

export default CommentListQueryDto;
