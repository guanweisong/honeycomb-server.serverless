import * as mongoose from 'mongoose';

export class LogoutDto {
  user_id: mongoose.Schema.Types.ObjectId;
  token_content: string;
}
