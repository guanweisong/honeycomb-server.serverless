import { PostCommentStatus } from '@/server/post/types/postCommentStatus';
import { PostStatus } from '@/server/post/types/postStatus';
import { PostType } from '@/server/post/types/postType';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

class PostCreateDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  public commentStatus: PostCommentStatus;

  @MaxLength(100, { message: '拍摄地点最大长度不可超过100' })
  @IsOptional()
  @Type(() => String)
  public galleryLocation: string;

  @IsOptional()
  @Type(() => String)
  public galleryStyleIds: string[];

  @IsOptional()
  @Type(() => Date)
  public galleryTime: string;

  @IsOptional()
  @Type(() => String)
  public movieActorIds: string[];

  @IsOptional()
  @Type(() => String)
  public movieDirectorIds: string[];

  @MaxLength(100, { message: '电影英文名称最大长度不可超过100' })
  @IsOptional()
  @Type(() => String)
  public movieNameEn: string;

  @IsOptional()
  @Type(() => String)
  public movieStyleIds: string[];

  @IsOptional()
  @Type(() => Date)
  public movieTime: string;

  @IsOptional()
  @Type(() => String)
  public authorId: string;

  @IsNotEmpty({ message: '分类不能为空' })
  @Type(() => String)
  public categoryId: string;

  @IsOptional()
  @MaxLength(10000, { message: '文章最大长度不可超过10000' })
  @Type(() => String)
  public content: string;

  @IsOptional()
  @Type(() => String)
  public coverId: string;

  @IsOptional()
  @MaxLength(200, { message: '文章简介最大长度不可超过200' })
  @Type(() => String)
  public excerpt: string;

  @IsEnum(PostStatus, { each: true, message: '文章状态不合法' })
  @IsNotEmpty({ message: '文章状态不能为空' })
  @Type(() => String)
  public status: PostStatus;

  @IsOptional()
  @MaxLength(100, { message: '文章名称最大长度不可超过100' })
  @Type(() => String)
  public title: string;

  @IsEnum(PostType, { each: true, message: '文章类型不合法' })
  @IsNotEmpty({ message: '文章类型不能为空' })
  @Type(() => String)
  public type: PostType;

  @IsOptional()
  @MaxLength(100, { message: '引用来源长度不可超过100' })
  @Type(() => String)
  public quoteAuthor: string;

  @IsOptional()
  @MaxLength(500, { message: '引用内容长度不可超过500' })
  @Type(() => String)
  public quoteContent: string;
}

export default PostCreateDto;
