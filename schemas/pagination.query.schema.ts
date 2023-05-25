import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  page: z.number().min(1, '最小页码是1').default(1),
  limit: z.number().min(1, '最小查询1条记录').default(10),
  sortField: z.string().default('createdAt'),
  sortOrder: z.string().default('desc'),
});
