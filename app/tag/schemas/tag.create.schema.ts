import { z } from 'zod';
import { NameSchema } from '@/app/tag/schemas/fields/name.schema';

export const TagCreateSchema = z.object({
  name: NameSchema,
});
