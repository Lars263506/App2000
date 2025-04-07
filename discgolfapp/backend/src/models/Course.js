import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    location: {
      type: String,
      required: true
    },
    postCode: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Difficult'],
      default: 'Medium'
    },
    familyFriendly: {
      type: Boolean,
      
    },
    holes: {
      type: Number,
      required: true,
    },
    pins: [
      {
        id: String,
        name: String,
        latitude: Number,
        longitude: Number,
        type: String,
        distance: Number,
        par: Number,
        outOfBounds: String,
      },
    ],
  },
  { timestamps: true }
)

const Course = mongoose.model('Course', schema)

export default Course
