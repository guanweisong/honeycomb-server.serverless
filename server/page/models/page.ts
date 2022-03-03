import * as mongoose from 'mongoose';
import { PageStatus } from '@/server/page/types/PageStatus';

const PageSchema = new mongoose.Schema(
  {
    page_title: {
      required: true,
      type: String,
      max: 20,
    },
    page_content: {
      required: true,
      type: String,
      max: 20000,
    },
    page_author: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    page_status: {
      type: Number,
      enum: PageStatus,
      enumDesc: '0：已发布, 1：草稿',
      required: true,
    },
    page_views: {
      type: Number,
      default: 0,
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

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
