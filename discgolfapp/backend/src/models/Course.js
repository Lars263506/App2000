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
      type: String, // Lagres som en streng i databasen
      get: (value) => {
        // Konverterer strengen til et array når vi leser fra databasen
        try {
          return JSON.parse(value);
        } catch (error) {
          return [];
        }
      },
      set: (value) => {
        // Konverterer arrayet til en streng når vi lagrer i databasen
        return JSON.stringify(value);
      },
    },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

const Course = mongoose.model('Course', schema);

export default Course;