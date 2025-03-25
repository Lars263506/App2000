import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    id: { 
      type: String, 
      required: true 
    },
    variable: { 
      type: String, 
      required: true 
    },
    deactivated: {
      type: Boolean,
      required: true
    },
    translations: {
      type: Map,
      of: String,
      required: true
    }
  },
  { timestamps: true }
);

const Translation = mongoose.model('Translation', schema);

export default Translation;