import { NextRequest } from 'next/server';
import Tools from '@/libs/tools';
import ResponseHandler from '@/libs/responseHandler';
import prisma from '@/libs/prisma';
import { DeleteBatchSchema } from '@/schemas/delete.batch.schema';
import { MediaListQuerySchema } from '@/app/media/schemas/media.list.query.schema';
import Cos from '@/libs/cos';
import moment from 'moment';
import { UserLevel } from '.prisma/client';
import { validateAuth } from '@/libs/validateAuth';
import { getQueryParams } from '@/libs/getQueryParams';
import { arraybufferToBuffer } from '@/libs/arraybufferToBuffer';
import sizeOf from 'image-size';

export async function GET(request: NextRequest) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR, UserLevel.GUEST]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const validate = MediaListQuerySchema.safeParse(getQueryParams(request));
  if (validate.success) {
    const { page, limit, sortField, sortOrder, ...rest } = validate.data;
    const conditions = Tools.getFindConditionsByQueries(rest, []);
    const list = await prisma.media.findMany({
      where: conditions,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.media.count({ where: conditions });
    const result = { list, total };
    return ResponseHandler.Query(result);
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const data = {} as any;
  data.name = file.name;
  data.size = file.size;
  data.type = file.type;
  const keyContent = moment().format('YYYY/MM/DD/HHmmssSSS');
  const filenameArray = file.name.split('.');
  const keySuffix = filenameArray[filenameArray.length - 1];
  const fileBuffer = await file.arrayBuffer();
  const cosResult = await Cos.putObject({
    Bucket: process.env.COS_BUCKET!,
    Region: process.env.COS_REGION!,
    Key: `${keyContent}.${keySuffix}`,
    Body: arraybufferToBuffer(fileBuffer),
  });
  if (file.type.startsWith('image')) {
    const dimensions = sizeOf(arraybufferToBuffer(fileBuffer));
    data.width = dimensions.width;
    data.height = dimensions.height;
  }
  data.url = `https://${cosResult.Location}`;
  data.key = `${keyContent}.${keySuffix}`;
  const result = await prisma.media.create({ data });
  return ResponseHandler.Create(result);
}

export async function DELETE(request: NextRequest) {
  const auth = await validateAuth(request, [UserLevel.ADMIN, UserLevel.EDITOR]);
  if (!auth.isOk) {
    return ResponseHandler.Forbidden({ message: auth.message });
  }
  const validate = DeleteBatchSchema.safeParse(getQueryParams(request));
  if (validate.success) {
    const list = await prisma.media.findMany({ where: { id: { in: validate.data.ids } } });
    const keys = list.map((item) => item.key);
    await prisma.media.deleteMany({ where: { id: { in: validate.data.ids } } });
    await Cos.deleteMultipleObject({
      Bucket: process.env.COS_BUCKET!,
      Region: process.env.COS_REGION!,
      Objects: keys.map((item) => ({
        Key: item,
      })),
    });
    return ResponseHandler.Delete();
  } else {
    return ResponseHandler.ValidateError(validate.error);
  }
}
