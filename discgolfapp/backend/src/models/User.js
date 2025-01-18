import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
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
