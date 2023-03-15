import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

class CommentUpdateDto {
  @IsOptional()
  @IsMongoId()
  public postId: string;

  @MaxLength(20, { message: '评论者昵称最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public author: string;

  @MaxLength(30, { message: '评论者邮箱最大长度不可超过30' })
  @IsOptional()
  @IsString()
  public email: string;

  @MaxLength(20, { message: '评论者IP最大长度不可超过20' })
  @IsOptional()
  @IsString()
  public ip: string;

  @MaxLength(200, { message: '评论内容最大长度不可超过200' })
  @IsOptional()
  @IsString()
  public content: string;

  @MaxLength(2000, { message: 'UA最大长度不可超过200' })
  @IsOptional()
  @IsString()
  public userAgent: string;

  @IsOptional()
  @IsMongoId()
  public parentId: string;
}

export default CommentUpdateDto;
