import mongoose from 'mongoose';

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
