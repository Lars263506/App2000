import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
      required: true,
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
      enum: ['Easy', 'Medium', 'Difficult'],
      default: 'Medium',
    },
    familyFriendly: {
      type: Boolean,
    },
    holes: {
      type: Number,
      required: true,
    },
    pins: {
      type: String,
      get: (value) => {
        try {
          return JSON.parse(value);
        } catch (error) {
          return [];
        }
      },
      set: (value) => {
        return JSON.stringify(value);
      },
    },
    lines: {
      type: String, // Lagres som en streng i databasen
      get: (value) => {
        try {
          return JSON.parse(value);
        } catch (error) {
          return [];
        }
      },
      set: (value) => {
        return JSON.stringify(value);
      },
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