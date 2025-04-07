import mongoose from 'mongoose'

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the Translation model.
 * It defines the structure of the Translation document in the database.
 */

const schema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      unique: true
    },
    key: {
      type: String,
      required: true,
      unique: true
    },
    translation: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
)

const Translation = mongoose.model('Translation', schema)

export default Translation
