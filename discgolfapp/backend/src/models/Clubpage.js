import mongoose from 'mongoose'

import Member from './Member.js'
import Invitation from './Invitation.js'
import Minute from './Minute.js'

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the ClubPage model.
 * It defines the structure of the ClubPage document in the database.
 */

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
    members: [
      Member.schema
    ],
    announcements: {
      type: Array,
      required: true
    },
    events: {
      type: Array,
      required: true
    },
    applications: {
      type: [
        {
          displayName: { type: String, required: true },
          email: { type: String, required: true },
          reason: { type: String, required: true },
          status: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'accepted', 'rejected']
          },
          date: { type: Date, default: Date.now() }
        }
      ],
      required: true
    },
    invitations: {
      type: [Invitation.schema],
      required: true
    },
    minutes: {
      type: [Minute.schema],
      required: true
    },
  },
  { timestamps: true }
)

const ClubPage = mongoose.model('Clubpage', schema)

export default ClubPage
