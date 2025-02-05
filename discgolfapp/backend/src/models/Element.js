import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true
        },
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    }
);

const Element = mongoose.model('Element', schema);

export default Element;
