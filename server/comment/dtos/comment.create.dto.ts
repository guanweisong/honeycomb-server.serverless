import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

class CommentCreateDto {
  @IsNotEmpty({ message: '评论文章ID不可为空' })
  @IsMongoId()
  public postId: string;

  @MaxLength(20, { message: '评论者昵称最大长度不可超过20' })
  @IsNotEmpty({ message: '评论者昵称不可为空' })
  @IsString()
  public author: string;

  @MaxLength(30, { message: '评论者邮箱最大长度不可超过30' })
  @IsNotEmpty({ message: '评论者邮箱不可为空' })
  @IsString()
  public email: string;

  @MaxLength(20, { message: '评论者IP最大长度不可超过20' })
  @IsNotEmpty({ message: '评论者IP不可为空' })
  @IsString()
  public ip: string;

  @MaxLength(200, { message: '评论内容最大长度不可超过200' })
  @IsNotEmpty({ message: '评论内容不可为空' })
  @IsString()
  public content: string;

  @MaxLength(2000, { message: 'UA最大长度不可超过200' })
  @IsNotEmpty({ message: 'UA内容不可为空' })
  @IsString()
  public userAgent: string;

  @IsOptional()
  @IsMongoId()
  public parentId: string;
}

export default CommentCreateDto;
