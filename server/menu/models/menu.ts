import * as mongoose from 'mongoose';
import { MenuType } from '@/server/menu/types/MenuType';

const MenuSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: Number,
      enum: MenuType,
      enumDesc: '0:分类, 1:页面',
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
    },
    power: {
      type: Number,
      max: 100,
      required: true,
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

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
