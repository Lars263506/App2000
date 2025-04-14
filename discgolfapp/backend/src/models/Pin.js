import mongoose from 'mongoose';

const pinSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Kurv', 'Utslagspunkt'],
  },
  distance: {
    type: Number,
  },
  par: {
      type: Number,
  },
  outOfBounds: {
      type: String,
      default: false,
  },
});

const Pin = mongoose.model('Pin', pinSchema);

export default Pin;
