import mongoose from 'mongoose';

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the Invitation model.
 * It defines the structure of the Invitation document in the database.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

const lineSchema = new mongoose.Schema({
    pinId1: { type: String, required: true },
    pinId2: { type: String, required: true }
});

const Line = mongoose.model('Line', lineSchema);

export default Line;
