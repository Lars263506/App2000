import mongoose from 'mongoose';

/**
 * @author Lars Andreas Strand and Adrian Johansen
 * @description This is the schema for the Member model.
 * It defines the structure of the Member document in the database.
 * Copilot has been used to generate the schema and comments,
 * but has been reviewed and edited by the authors.
 */

const memberSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['member', 'clubowner', 'admin'],
    default: 'member'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: ''

  }

});


const Member = mongoose.model('Member', memberSchema);

export default Member;
