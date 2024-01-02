import prisma from '@/libs/prisma';
import ResponseHandler from '@/libs/responseHandler';
import { NextRequest } from 'next/server';
import { PostUpdateSchema } from '@/app/post/schemas/post.update.schema';
import { Media, UserLevel } from '.prisma/client';
import { getRelationTags } from '@/libs/getRelationTags';
import { getAllImageLinkFormMarkdown } from '@/libs/getAllImageLinkFormMarkdown';
import { validateAuth } from '@/libs/validateAuth';
import { validateParams } from '@/libs/validateParams';
import { errorHandle } from '@/libs/errorHandle';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return errorHandle(async () => {
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

    const imageUrls: string[] = getAllImageLinkFormMarkdown(result?.content?.zh);
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
  });
}

export async function PATCH(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  return validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR], async () => {
    const params = await request.clone().json();
    return validateParams(PostUpdateSchema, params, async (data) => {
      return errorHandle(async () => {
        const result = await prisma.post.update({ where: { id }, data });
        return ResponseHandler.Update(result);
      });
    });
  });
}
