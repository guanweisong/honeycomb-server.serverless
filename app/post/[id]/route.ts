import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { NextRequest } from 'next/server';
import { PostUpdateSchema } from '@/app/post/schemas/post.update.schema';
import { Media, UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';
import { getRelationTags } from '@/libs/getRelationTags';
import { getAllImageLinkFormMarkdown } from '@/libs/getAllImageLinkFormMarkdown';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const result = await prisma.post.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          title: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      cover: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  const [movieActors, movieDirectors, movieStyles, galleryStyles] = await Promise.all([
    getRelationTags(result?.movieActorIds),
    getRelationTags(result?.movieDirectorIds),
    getRelationTags(result?.movieStyleIds),
    getRelationTags(result?.galleryStyleIds),
  ]);

  let imageUrls: string[] = getAllImageLinkFormMarkdown(result?.content);
  imageUrls = imageUrls.map((item) => item.split('//')[1]);
  let imagesInContent: Media[] = [];
  if (imageUrls.length) {
    imagesInContent = await prisma.media.findMany({ where: { url: { in: imageUrls } } });
  }

  return ResponseHandler.Query({
    ...result,
    movieActors,
    movieDirectors,
    movieStyles,
    galleryStyles,
    imagesInContent,
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const id = params.id;
  const data = await request.clone().json();
  const validate = PostUpdateSchema.safeParse(data);
  if (validate.success) {
    const result = await prisma.post.update({ where: { id }, data: validate.data });
    return ResponseHandler.Update(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
