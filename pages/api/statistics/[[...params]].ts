import { createHandler, UseMiddleware, Get } from '@storyofams/next-api-decorators';
import DatabaseGuard from '@/middlewares/database.middlewar';
import PostModel from '@/server/post/models/post';
import User from '@/server/user/models/user';
import Comment from '@/server/comment/models/comment';
import { StatisticsInterface } from '@/server/statistic/types/StatisticType';

class StatisticsHandler {
  @Get()
  @DatabaseGuard()
  async findAll() {
    const result = {} as StatisticsInterface;
    // 获取文章统计
    const postArray = [0, 1, 2, 3];
    result.postType = [];
    for (let i = 0, len = postArray.length; i < len; i++) {
      result.postType.push({
        item: postArray[i],
        count: await PostModel.count({ post_type: postArray[i] }),
      });
    }
    // 获取用户类型统计
    const userArray = [1, 2, 3];
    result.userType = [];
    for (let i = 0, len = userArray.length; i < len; i++) {
      result.userType.push({
        item: userArray[i],
        count: await User.count({ user_level: userArray[i] }),
      });
    }
    // 获取评论统计
    const commentArray = [0, 1, 2, 3];
    result.commentStatus = [];
    for (let i = 0, len = commentArray.length; i < len; i++) {
      result.commentStatus.push({
        item: commentArray[i],
        count: await Comment.count({
          comment_status: commentArray[i],
        }),
      });
    }
    // 获取用户下文章数目
    result.userPost = [];
    const userList = await User.find();
    for (let i = 0, len = userList.length; i < len; i++) {
      result.userPost.push({
        item: userList[i].user_name,
        count: await PostModel.count({
          post_author: userList[i]._id,
        }),
      });
    }
    return result;
  }
}

export default createHandler(StatisticsHandler);
