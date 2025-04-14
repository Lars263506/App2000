import mongoose from 'mongoose';

const lineSchema = new mongoose.Schema({
  lineId1: {
    type: String,
    required: true,
  },
  lineId2: {
    type: String,
    required: true,
  },
});

const Line = mongoose.model('Line', lineSchema);

export default Line;
