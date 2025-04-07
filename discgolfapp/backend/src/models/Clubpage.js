import mongoose from 'mongoose'

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
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
        displayName: { type: String, required: true },
        role: { type: String, required: true },
        profilePicture: { type: String, default: '' },
      },
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
    }
  },
  { timestamps: true }
)

const ClubPage = mongoose.model('Clubpage', schema)

export default ClubPage
