import { PostType } from '@/server/post/types/postType';
import { CommentStatus } from '@/server/comment/types/commentStatus';
import { UserStatus } from '@/server/user/types/UserStatus';

export class StatisticsInterface {
  postType: {
    item: PostType;
    count: number;
  }[];
  userType: {
    item: UserStatus;
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
