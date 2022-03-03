import * as mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    media_name: {
      type: String,
      max: 20,
      required: true,
    },
    media_type: {
      type: String,
      required: true,
    },
    media_url: {
      type: String,
      required: true,
    },
    media_size: {
      type: Number,
      required: true,
    },
    media_key: {
      type: String,
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

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
