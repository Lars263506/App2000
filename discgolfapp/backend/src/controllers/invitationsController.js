import * as invitationsService from '../services/invitationsService.js';

/**
 * @author Lars Andreas Strand
 * @description This file contains the controller functions for the invitations routes.
 * It handles the requests and responses for getting, adding, deleting, and updating invitations.
 * It uses the invitationsService to interact with the database and perform the necessary operations.
 * It also handles errors and sends appropriate responses to the client.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get all invitations for a user.
 * It retrieves all invitations from the database and sends them as a response.
 * If successful, it sends a 200 status code and the invitations data.
 */

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

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to add an invitation.
 * It retrieves the invitation data from the request body and adds it to the database.
 * If successful, it sends a 201 status code and the created invitation data.
 * If there is an error, it sends a 500 status code and the error message.
 */

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

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to delete an invitation.
 * It retrieves the invitation ID from the request body and deletes it from the database.
 * If successful, it sends a 200 status code.
 * If there is an error, it sends a 500 status code and the error message.
 */

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

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to update an invitation.
 * It retrieves the invitation ID and updated data from the request body and updates it in the database.
 * If successful, it sends a 200 status code and the updated invitation data.
 * If there is an error, it sends a 500 status code and the error message.
 */

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
