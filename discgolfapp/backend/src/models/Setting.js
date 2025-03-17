import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
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
