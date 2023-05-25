import { PaginationQuerySchema } from '@/schemas/pagination.query.schema';
import { TitleSchema } from '@/app/post/schemas/fields/title.schema';
import { ContentSchema } from '@/app/post/schemas/fields/content.schema';
import { StatusSchema } from '@/app/post/schemas/fields/status.schema';
import { TypeSchema } from '@/app/post/schemas/fields/type.schema';
import { IdSchema } from '@/schemas/fields/id.schema';
import { z } from 'zod';

export const PostListQuerySchema = PaginationQuerySchema.extend({
  title: TitleSchema.optional(),
  content: ContentSchema.optional(),
  status: StatusSchema.array().optional(),
  type: TypeSchema.array().optional(),
  categoryId: IdSchema.optional(),
  tagName: z.string().optional(),
  userName: z.string().optional(),
});
