import mongoose from 'mongoose'

const getStartedContentSchema = new mongoose.Schema({
  beginnerTitle: { type: String, required: true },
  beginnerDescription: { type: String, required: true },
  advancedTitle: { type: String, required: true },
  advancedDescription: { type: String, required: true },
}, { timestamps: true })

const GetStartedContent = mongoose.model('GetStartedContent', getStartedContentSchema)

export default GetStartedContent
