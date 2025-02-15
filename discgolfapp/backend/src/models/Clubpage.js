import mongoose, { Mongoose } from 'mongoose';
import Element from './Element.js';

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
            type: [Element.schema],
            required: true
        },
        memberElements: {
            type: [Element.schema],
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
            type: [mongoose.Schema.Types.ObjectId],
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
