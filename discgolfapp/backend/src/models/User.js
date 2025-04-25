import mongoose from 'mongoose'
import Setting from './Setting.js'

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the User model.
 * It defines the structure of the User document in the database.
 * Copilot has been used to generate the schema and comments,
 * but has been reviewed and edited by the author.
 */

const schema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin', 'member', 'clubowner'],
      default: 'user'
    },
    emailChangedAt: {
      type: Date,
      required: true
    },
    passwordChangedAt: {
      type: Date,
      required: true
    },
    roleChangedAt: {
      type: Date,
      required: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    settings: {
      type: [Setting.schema],
    },
    games: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    }],
  },
  { timestamps: true }
)

const User = mongoose.model('User', schema)

export default User
