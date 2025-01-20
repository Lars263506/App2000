import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true,
            unique: true
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        hashedPassword: { 
            type: String, 
            required: true 
        },
        role: {
            type: String,
            required: true,
            enum: ['user', 'admin', 'member', 'clubowner'],
            default: 'user',
        },
        emailChangedAt: { 
            type: Date, 
            required: true 
        },
        passwordChangedAt: { 
            type: Date, 
            required: true 
        },
        roleChangedAt: { 
            type: Date, 
            required: true 
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', schema);

export default User;
