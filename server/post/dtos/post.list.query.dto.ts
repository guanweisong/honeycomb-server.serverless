import PaginationType from '../../../types/PaginationType';
import { IsArray, IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PostType } from '@/server/post/types/postType';
import { PostStatus } from '@/server/post/types/postStatus';
import { SortType } from '@/types/SortType';

class PostListQueryDto extends PaginationType {
  @MaxLength(20, { message: '标签名称最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public tag_name: string;

  @MaxLength(20, { message: '用户名称最大长度不可超过20' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public user_name: string;

  @MaxLength(200, { message: '关键词最大长度不可超过200' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public keyword: string;

  @IsMongoId()
  @IsOptional()
  @Type(() => String)
  public category_id: string;

  @IsArray({ message: '文章类型必须为数组' })
  @IsOptional()
  @Type(() => Number)
  public post_type: PostType[];

  @IsArray({ message: '文章状态必须为数组' })
  @IsOptional()
  @Type(() => Number)
  public post_status: PostStatus[];

  @IsString()
  @IsOptional()
  @Type(() => String)
  public sortField: string;

  @IsEnum(SortType, { message: '排序方式不合法' })
  @IsOptional()
  @Type(() => String)
  public sortOrder: SortType;
}

export default PostListQueryDto;
