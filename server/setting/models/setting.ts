import * as mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  site_name: {
    type: String,
    required: true,
    max: 50,
  },
  site_subName: {
    type: String,
    max: 100,
    required: true,
  },
  site_signature: {
    type: String,
    max: 100,
    required: true,
  },
  site_copyright: {
    type: String,
    max: 100,
    required: true,
  },
  site_record_no: {
    type: String,
    max: 100,
  },
  site_record_url: {
    type: String,
    max: 100,
  },
});

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
