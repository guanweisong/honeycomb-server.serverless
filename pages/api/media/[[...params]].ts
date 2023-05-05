import DeleteParamsDto from '@/dtos/delete.params.dto';
import prisma from '@/libs/prisma';
import Auth from '@/middlewares/auth.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';
import { HttpStatus } from '@/types/HttpStatus';
import PaginationType from '@/types/PaginationType';
import Cos from '@/utils/cos';
import moment from 'moment';
import {
  createHandler,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  ValidationPipe,
} from 'next-api-decorators';

class MediaHandler {
  @Get()
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR, UserLevel.GUEST])()
  async findAll(
    @Query(ValidationPipe)
    query: PaginationType,
  ) {
    const { page, limit } = query;
    const list = await prisma.media.findMany({
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });
    const total = await prisma.media.count();
    return { list, total };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async create(@UploadedFile() file: any) {
    const data = {} as any;
    data.media_name = file.originalname;
    data.media_size = file.size;
    data.media_type = file.mimetype;
    const keyContent = moment().format('YYYY/MM/DD/HHmmssSSS');
    const filenameArray = file.originalname.split('.');
    const keySuffix = filenameArray[filenameArray.length - 1];
    const result = await Cos.putObject({
      Bucket: process.env.COS_BUCKET!,
      Region: process.env.COS_REGION!,
      Key: `${keyContent}.${keySuffix}`,
      Body: file.buffer,
    });
    data.media_url = result.Location;
    data.media_key = `${keyContent}.${keySuffix}`;
    return prisma.media.create({ data });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    const list = await prisma.media.findMany({ where: { id: { in: query.ids } } });
    const keys = list.map((item) => item.key);
    await prisma.media.deleteMany({ where: { id: { in: query.ids } } });
    await Cos.deleteMultipleObject({
      Bucket: process.env.COS_BUCKET!,
      Region: process.env.COS_REGION!,
      Objects: keys.map((item) => ({
        Key: item,
      })),
    });
    return null;
  }
}

export default createHandler(MediaHandler);
