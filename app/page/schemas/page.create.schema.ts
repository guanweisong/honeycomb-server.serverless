import { z } from 'zod';
import { TitleSchema } from '@/app/page/schemas/fields/title.schema';
import { ContentSchema } from '@/app/page/schemas/fields/content.schema';
import { StatusSchema } from '@/app/page/schemas/fields/status.schema';

export const PageCreateSchema = z.object({
  title: TitleSchema,
  content: ContentSchema,
  status: StatusSchema,
});

