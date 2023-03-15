import { CommentStatus } from '@/server/comment/types/commentStatus';
import { PostType } from '@/server/post/types/postType';
import { UserLevel } from '@/server/user/types/UserLevel';

export class StatisticsInterface {
  postType: {
    item: PostType;
    count: number;
  }[];
  userType: {
    item: UserLevel;
    count: number;
  }[];
  userPost: {
    item: string;
    count: number;
  }[];
  commentStatus: {
    item: CommentStatus;
    count: number;
  }[];
}
