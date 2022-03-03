import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
      unique: true,
      max: 20,
    },
    user_level: {
      type: Number,
      enum: [1, 2, 3],
      enumDesc: '1：管理员，2：编辑，3：访客',
      required: true,
    },
    user_name: {
      type: String,
      required: true,
      unique: true,
      max: 20,
    },
    user_password: {
      type: String,
      match: /\w+/,
      required: true,
      max: 20,
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
    user_status: {
      type: Number,
      enum: [-1, 0, 1],
      enumDesc: '-1：删除，0：禁用, 1：启用',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
