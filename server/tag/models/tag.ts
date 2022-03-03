import * as mongoose from 'mongoose';

const TagSchema = new mongoose.Schema(
  {
    tag_name: {
      type: String,
      max: 20,
      unique: true,
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

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);
