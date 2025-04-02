import mongoose from 'mongoose'

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the Course model.
 * It defines the structure of the Course document in the database.
 */

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
      resquired: true,
    }, 
  },
  { timestamps: true }
)

const Course = mongoose.model('Course', schema)

export default Course
