import * as mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    category_title: {
      type: String,
      required: true,
      max: 20,
    },
    category_title_en: {
      type: String,
      required: true,
      max: 20,
    },
    category_parent: {
      type: String,
      required: false,
    },
    category_description: {
      type: String,
      max: 200,
    },
    category_status: {
      type: Number,
      required: true,
      enum: [0, 1],
      enumDesc: '0：禁用, 1：启用',
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

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
