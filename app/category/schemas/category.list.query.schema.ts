import { PaginationQuerySchema } from '@/schemas/pagination.query.schema';
import { TitleSchema } from '@/app/category/schemas/fields/title.schema';
import { TitleEnSchema } from '@/app/category/schemas/fields/title.en.schema';
import { StatusSchema } from '@/app/category/schemas/fields/status.schema';
import { IdSchema } from '@/schemas/fields/id.schema';
import { z } from 'zod';

export const CategoryListQuerySchema = PaginationQuerySchema.extend({
  id: IdSchema.optional(),
  title: TitleSchema.optional(),
  titleEn: TitleEnSchema.optional(),
  status: z.union([StatusSchema.array(), StatusSchema]).optional(),
});
