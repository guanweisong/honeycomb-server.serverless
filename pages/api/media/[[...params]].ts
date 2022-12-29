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
import Media from '@/server/media/models/media';
import DatabaseGuard from '@/middlewares/database.middlewar';
import ParseQueryGuard from '@/middlewares/parse.query.middlewar';
import { HttpStatus } from '@/types/HttpStatus';
import moment from 'moment';
import DeleteParamsDto from '@/dtos/delete.params.dto';
import PaginationType from '@/types/PaginationType';
import Cos from '@/utils/cos';
import Auth from '@/middlewares/auth.middlewar';
import { UserLevel } from '@/server/user/types/UserLevel';

class MediaHandler {
  @Get()
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR, UserLevel.GUEST])()
  async findAll(
    @Query(ValidationPipe)
    query: PaginationType,
  ) {
    const { page, limit } = query;
    const list = await Media.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updated_at: -1 })
      .lean();
    const total = await Media.count();
    return { list, total };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @DatabaseGuard()
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
    const model = new Media(data);
    return model.save();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ParseQueryGuard()
  @DatabaseGuard()
  @Auth([UserLevel.ADMIN, UserLevel.EDITOR])()
  async deleteMany(@Query(ValidationPipe) query: DeleteParamsDto) {
    const list = await Media.find({ _id: { $in: query.ids } });
    const keys = list.map((item) => item.media_key);
    await Media.deleteMany({ _id: { $in: query.ids } });
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
