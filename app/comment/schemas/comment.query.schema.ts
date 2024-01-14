import { z } from 'zod';
import { CommentType } from '@/prisma/CommentType';

const CommentTypeEnum = z.nativeEnum(CommentType);

export const CommentQuerySchema = z.object({
  type: CommentTypeEnum,
});
