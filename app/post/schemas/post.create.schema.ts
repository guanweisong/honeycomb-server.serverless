import { z } from 'zod';
import { TitleSchema } from '@/app/post/schemas/fields/title.schema';
import { ContentSchema } from '@/app/post/schemas/fields/content.schema';
import { StatusSchema } from '@/app/post/schemas/fields/status.schema';
import { IdSchema } from '@/schemas/fields/id.schema';
import { ExcerptSchema } from '@/app/post/schemas/fields/excerpt.schema';
import { TypeSchema } from '@/app/post/schemas/fields/type.schema';
import { QuoteAuthorSchema } from '@/app/post/schemas/fields/quote.author.schema';
import { QuoteContentSchema } from '@/app/post/schemas/fields/quote.content.schema';
import { MovieNameEnSchema } from '@/app/post/schemas/fields/movie.name.en.schema';
import { GalleryLocationSchema } from '@/app/post/schemas/fields/gallery.location.schema';
import { CommentStatusSchema } from '@/app/post/schemas/fields/comment.status.schema';
import { DatetimeSchema } from '@/schemas/fields/datetime.schema';

export const PostCreateSchema = z.object({
  title: TitleSchema.optional(),
  content: ContentSchema.optional(),
  excerpt: ExcerptSchema.optional(),
  status: StatusSchema.optional(),
  type: TypeSchema.optional(),
  categoryId: IdSchema,
  coverId: IdSchema.optional(),
  commentStatus: CommentStatusSchema.optional(),
  quoteAuthor: QuoteAuthorSchema.optional(),
  quoteContent: QuoteContentSchema.optional(),
  movieTime: DatetimeSchema.optional(),
  movieNameEn: MovieNameEnSchema.optional(),
  movieStyleIds: IdSchema.array().optional(),
  movieActorIds: IdSchema.array().optional(),
  movieDirectorIds: IdSchema.array().optional(),
  galleryLocation: GalleryLocationSchema.optional(),
  galleryStyleIds: IdSchema.array().optional(),
  galleryTime: DatetimeSchema.optional(),
});
