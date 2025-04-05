import mongoose from 'mongoose'

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the ClubPage model.
 * It defines the structure of the ClubPage document in the database.
 */

import Member from './Member.js'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    clubOwner: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    websiteURL: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    members: {
      type: [Member.schema],
      required: true
    },
    events: {
      type: Array,
      required: true
    }
  },
  { timestamps: true }
)

const ClubPage = mongoose.model('Clubpage', schema)

export default ClubPage
