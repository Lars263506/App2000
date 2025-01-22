import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            unique: true 
        },
        clubOwner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        description: { 
            type: String,
            required: true
        },
        nonmemberElements: {
            type: Array,
            required: true
        },
        memberElements: {
            type: Array,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        websiteURL: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        members: {
            type: Array,
            required: true
        },
        events: {
            type: Array,
            required: true
        }
    },
    { timestamps: true }
);

const ClubPage = mongoose.model('Clubpage', schema);

export default ClubPage;
