import mongoose from 'mongoose';

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the Invitation model.
 * It defines the structure of the Invitation document in the database.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

const invitationSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    text: { type: String, required: true },
});

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
