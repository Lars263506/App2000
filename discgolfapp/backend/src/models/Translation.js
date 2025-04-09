import mongoose from 'mongoose'

/**
 * @description This is the schema for the Translation model.
 * It defines the structure of the Translation document in the database.
 */

const schema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    translation: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
)

// Ensure the combination of language and key is unique
schema.index({ language: 1, key: 1 }, { unique: true })

const Translation = mongoose.model('Translation', schema)

export default Translation
