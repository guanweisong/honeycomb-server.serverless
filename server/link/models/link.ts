import * as mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema(
  {
    link_url: {
      type: String,
      required: true,
      unique: true,
      max: 20,
    },
    link_name: {
      type: String,
      max: 20,
      required: true,
    },
    link_description: {
      type: String,
      required: true,
      max: 200,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    link_status: {
      type: Number,
      enum: [0, 1],
      enumDesc: '0：禁用, 1：启用',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.models.Link || mongoose.model('Link', LinkSchema);
