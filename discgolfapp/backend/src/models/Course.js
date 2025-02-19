import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        id: { 
            type: Number, 
            required: true, 
            unique: true 
        },
        name: { 
            type: String, 
            required: true, 
            unique: true 
        },
        location: {
            type: String,
            required: true
        },
        url: { 
            type: String,
            required: true
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
    { timestamps: true }
);

const Course = mongoose.model('Course', schema);

export default Course;
