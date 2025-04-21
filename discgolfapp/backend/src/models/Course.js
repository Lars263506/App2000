import mongoose from 'mongoose';

import Pin from './Pin.js';
import Line from './Line.js';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    courseOwner: {
      type: String,
      default: 'Unknown', 
    },
    location: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    postCode: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    familyFriendly: {
      type: Boolean,
    },
    holes: {
      type: Number,
    },
    pins: {
      type: [Pin.schema],
      default: []
    },
    lines: {
      type: [Line.schema],
      default: []
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

const Course = mongoose.model('Course', schema);

export default Course;
