import * as invitationsService from '../services/invitationsService.js';

const getInvitations = async (req, res) => {
    try {
        const userId = req.user.id;
        const invitations = await invitationsService.getInvitations(userId);
        res.status(200).json(invitations);
    } catch (error) {
        console.error('Error fetching invitations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const addInvitation = async (req, res) => {
    try {
        const clubownerId = req.user.id;
        const { id, title, description, text } = req.body;
        const invitation = await invitationsService.addInvitation(clubownerId, id, title, description, text);
        res.status(201).json(invitation);
    } catch (error) {
        console.error('Error adding invitation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteInvitation = async (req, res) => {
    try {
        const clubownerId = req.user.id;
        const { invitationId, clubId } = req.body;
        await invitationsService.deleteInvitation(clubownerId, invitationId, clubId);
        res.status(200).send();
    } catch (error) {
        console.error('Error deleting invitation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateInvitation = async (req, res) => {
    try {
        const clubownerId = req.user.id;
        const { invitationId, clubId, request } = req.body;
        const updatedInvitation = await invitationsService.updateInvitation(clubownerId, invitationId, clubId, request);
        res.status(200).json(updatedInvitation);
    } catch (error) {
        console.error('Error updating invitation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { getInvitations, addInvitation, deleteInvitation, updateInvitation };
