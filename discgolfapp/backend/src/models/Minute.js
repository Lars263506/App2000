import mongoose from 'mongoose';

const minutesShema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    text: { type: String, required: true },
});

const Minute = mongoose.model('Minute', minutesShema);

export default Minute;
