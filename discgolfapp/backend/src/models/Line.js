import mongoose from 'mongoose';

const lineSchema = new mongoose.Schema({
    pinId1: { type: String, required: true },
    pinId2: { type: String, required: true }
});

const Line = mongoose.model('Line', lineSchema);

export default Line;
