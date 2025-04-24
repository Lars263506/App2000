import mongoose from 'mongoose'

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the Setting model.
 * It defines the structure of the Setting document in the database.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
)

const Setting = mongoose.model('Setting', schema)

export default Setting
