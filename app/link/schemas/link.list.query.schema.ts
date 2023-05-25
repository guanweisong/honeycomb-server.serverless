import { PaginationQuerySchema } from '@/schemas/pagination.query.schema';
import { NameSchema } from '@/app/link/schemas/fields/name.schema';
import { UrlSchema } from '@/schemas/fields/url.schema';
import { DescriptionSchema } from '@/app/link/schemas/fields/description.schema';
import { StatusSchema } from '@/app/link/schemas/fields/status.schema';

export const LinkListQuerySchema = PaginationQuerySchema.extend({
  name: NameSchema.optional(),
  url: UrlSchema.optional(),
  description: DescriptionSchema.optional(),
  status: StatusSchema.array().optional(),
});
