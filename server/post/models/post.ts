// @ts-nocheck
import * as mongoose from 'mongoose';
import { PostType } from '@/server/post/types/postType';

const PostSchema = new mongoose.Schema(
  {
    post_title: {
      type: String,
      max: 20,
      required() {
        return [PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(this.post_type);
      },
    },
    post_content: {
      type: String,
      max: 20000,
      required() {
        return [PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(this.post_type);
      },
    },
    post_excerpt: {
      type: String,
      max: 200,
    },
    post_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    post_author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post_status: {
      type: Number,
      enum: [PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH],
      enumDesc: '0：已发布, 1：草稿, 2: 待审核',
      default: 1,
      required: true,
    },
    comment_status: {
      type: Number,
      enum: [0, 1],
      enumDesc: '0：禁用, 1：启用',
      default: 1,
      required: true,
    },
    post_views: {
      type: Number,
      default: 0,
    },
    post_type: {
      type: Number,
      enum: [0, 1, 2, 3],
      enumDesc: '0：文章, 1：电影, 2: 画廊, 3: 引用',
      default: 0,
      required: true,
    },
    post_cover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
      required() {
        return [PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(this.post_type);
      },
    },
    movie_time: {
      type: Date,
    },
    movie_name_en: {
      type: String,
      max: 20,
    },
    movie_director: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    movie_actor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    movie_style: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    gallery_location: {
      type: String,
      max: 20,
    },
    gallery_time: {
      type: Date,
    },
    gallery_style: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    quote_author: {
      type: String,
      max: 50,
      required() {
        return this.post_type === PostType.QUOTE;
      },
    },
    quote_content: {
      type: String,
      max: 500,
      required() {
        return this.post_type === PostType.QUOTE;
      },
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

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
