import { z } from 'zod';
import { TitleSchema } from '@/app/category/schemas/fields/title.schema';
import { TitleEnSchema } from '@/app/category/schemas/fields/title.en.schema';
import { StatusSchema } from '@/app/category/schemas/fields/status.schema';
import { DescriptionSchema } from '@/app/category/schemas/fields/description.schema';
import { IdSchema } from '@/schemas/fields/id.schema';

export const CategoryCreateSchema = z.object({
  title: TitleSchema,
  titleEn: TitleEnSchema,
  status: StatusSchema,
  description: DescriptionSchema,
  parent: IdSchema,
});
