import { AuthorSchema } from '@/app/comment/schemas/fields/author.schema';
import { ContentSchema } from '@/app/comment/schemas/fields/content.schema';
import { IdSchema } from '@/schemas/fields/id.schema';
import { EmailSchema } from '@/app/user/schemas/fields/email.schema';
import { CaptchaSchema } from '@/schemas/captcha.schema';
import { StatusSchema } from '@/app/comment/schemas/fields/status.schema';

export const CommentCreateSchema = CaptchaSchema.extend({
  author: AuthorSchema,
  content: ContentSchema,
  email: EmailSchema,
  parentId: IdSchema.optional(),
  postId: IdSchema,
  status: StatusSchema,
});