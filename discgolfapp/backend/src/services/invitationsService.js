import Invitation from '../models/Invitation.js';

const getInvitations = async (userId) => {
    try {
        const invitations = await Invitation.find({ userId });
        return invitations;
    } catch (error) {
        console.error('Error fetching invitations:', error);
        throw new Error('Internal server error');
    }
}

const addInvitation = async (clubId, title, description, text) => {
    try {
        const invitation = new Invitation({ userId, email, clubId });
        await invitation.save();
        return invitation;
    } catch (error) {
        console.error('Error adding invitation:', error);
        throw new Error('Internal server error');
    }
}

const deleteInvitation = async (userId, invitationId) => {
    try {
        await Invitation.deleteOne({ _id: invitationId, userId });
    } catch (error) {
        console.error('Error deleting invitation:', error);
        throw new Error('Internal server error');
    }
}

const updateInvitation = async (userId, invitationId, status) => {
    try {
        const updatedInvitation = await Invitation.findOneAndUpdate(
            { _id: invitationId, userId },
            { status },
            { new: true }
        );
        return updatedInvitation;
    } catch (error) {
        console.error('Error updating invitation:', error);
        throw new Error('Internal server error');
    }
}

export { getInvitations, addInvitation, deleteInvitation, updateInvitation };
