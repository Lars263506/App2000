import Invitation from '../models/Invitation.js';
import ClubPage from '../models/Clubpage.js';
import User from '../models/User.js';

const getInvitations = async (userId) => {
    try {
        const user = await User.findById(userId).select('displayName');

        const club = await ClubPage.findOne({
            members: {
                $elemMatch: {
                    displayName: user.displayName
                }
            }
        }).select('invitations');

        if (!club) {
            return []
        }
        return club.invitations;
    } catch (error) {
        console.error('Error fetching invitations:', error);
        throw new Error(error.message);
    }
}

const addInvitation = async (clubownerId, id, title, description, text) => {
    try {
        const clubOwner = await User.findById(clubownerId).select('displayName');

        if (!clubOwner) {
            throw new Error('User must be the club owner to add invitations.');
        }

        await ClubPage.findOneAndUpdate({ clubOwner: clubOwner.displayName },
            { $push: {
                invitations: {
                    id,
                    title,
                    description,
                    text
                }
            } }
        );
    } catch (error) {
        console.error('Error adding invitation:', error);
        throw new Error(error.message);
    }
}

const deleteInvitation = async (clubownerId, invitationId, clubId) => {
    try {
        const user = await User.findById(clubownerId).select('displayName');

        const club = await ClubPage.findOneAndUpdate(
            { clubOwner: user.displayName, _id: clubId },
            { $pull: { invitations: { id: invitationId } } }
        );

        if (!club) {
            throw new Error('Club not found or user is not the club owner.');
        }

    } catch (error) {
        console.error('Error deleting invitation:', error);
        throw new Error(error.message);
    }
}

const updateInvitation = async (userId, invitationId, clubId, request) => {
    try {
        if (!request) {
            throw new Error('Request object is undefined.');
        }

        const user = await User.findById(userId).select('displayName');

        const updateFields = {};
        if (request.title) updateFields['invitations.$[elem].title'] = request.title;
        if (request.description) updateFields['invitations.$[elem].description'] = request.description;
        if (request.text) updateFields['invitations.$[elem].text'] = request.text;

        const club = await ClubPage.findOneAndUpdate(
            { clubOwner: user.displayName, _id: clubId },
            { $set: updateFields },
            { arrayFilters: [{ 'elem.id': invitationId }], new: true }
        );

        if (!club) {
            throw new Error('Club not found or user is not the club owner.');
        }

        return club.invitations;
    } catch (error) {
        console.error('Error updating invitation:', error);
        throw new Error(error.message);
    }
}

export { getInvitations, addInvitation, deleteInvitation, updateInvitation };
