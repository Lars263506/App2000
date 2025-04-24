import mongoose from 'mongoose';

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the Pin model.
 * It defines the structure of the Pin document in the database.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

const pinSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    type: { type: String, enum: ["kurv", "Utslagspunkt"], required: true },
    distance: { type: Number, required: false },
    par: { type: Number, required: false },
    outOfBounds: { type: String, required: false },
});

const Pin = mongoose.model('Pin', pinSchema);

export default Pin;
