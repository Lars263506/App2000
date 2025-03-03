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
      type: Number,
      required: true
    },
    familyFriendly: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
)

const Course = mongoose.model('Course', schema)

export default Course
