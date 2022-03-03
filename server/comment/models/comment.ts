import * as mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    comment_post: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    comment_author: {
      required: true,
      type: String,
      max: 20,
    },
    comment_email: {
      required: true,
      type: String,
      max: 30,
    },
    comment_ip: {
      required: true,
      type: String,
      max: 20,
    },
    comment_content: {
      required: true,
      type: String,
      max: 2000,
    },
    comment_status: {
      type: Number,
      enum: [0, 1, 2, 3],
      enumDesc: '0：待审核, 1：允许发布，2：垃圾评论，3：屏蔽',
      default: 1,
    },
    comment_agent: {
      required: true,
      type: String,
      max: 2000,
    },
    comment_parent: {
      type: mongoose.Schema.Types.ObjectId,
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
