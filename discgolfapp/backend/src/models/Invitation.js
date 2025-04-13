import { text } from 'express';
import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    text: { type: String, required: true },
});

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
