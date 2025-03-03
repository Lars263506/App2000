import mongoose from 'mongoose'

/**
 * @author Lars Andreas Strand og Adrian Johansen
 * @description Model for elements
 */

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    uniqueId: {
      type: String,
      required: true,
      unique: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  }
)

const Element = mongoose.model('Element', schema)

export default Element
