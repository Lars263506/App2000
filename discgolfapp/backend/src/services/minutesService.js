import ClubPage from '../models/Clubpage.js';
import User from '../models/User.js';

/**
 * @author Lars Andreas Strand
 * @description This file contains the invitationsService, which is responsible for handling invitations-related tasks.
 * It includes functions for getting, adding, deleting, and updating invitations.
 * Copilot was used to structure the code and provide suggestions, but the logic and implementation were done by the author.
 */

/**
 * @author Lars Andreas Strand
 * @description This function retrieves invitations for a user.
 * It takes a userId as input and returns an array of invitations.
 * If the user is not found or there are no invitations, it returns an empty array.
 * If an error occurs, it logs the error and throws a new error with the error message.
 * @param {string} userId - The ID of the user for whom to retrieve invitations.
 * @return {Array} - An array of invitations for the user.
 * @throws {Error} - If there was an error during the retrieval.
 */

const getMinutes = async (userId) => {
    try {
        const user = await User.findById(userId).select('displayName');

        const club = await ClubPage.findOne({
            members: {
                $elemMatch: {
                    displayName: user.displayName
                }
            }
        }).select('minutes');

        if (!club) {
            return [];
        }
        return club.minutes;
    } catch (error) {
        console.error('Error fetching minutes:', error);
        throw new Error(error.message);
    }
};

/**
 * @author Lars Andreas Strand
 * @description This function adds an invitation to a club.
 * It takes the clubownerId, id, title, description, and text as input.
 * It first checks if the user is the club owner, and if not, it throws an error.
 * If the user is the club owner, it adds the invitation to the club's invitations array.
 * If an error occurs, it logs the error and throws a new error with the error message.
 * @param {string} clubownerId - The ID of the club owner.
 * @param {string} id - The ID of the invitation.
 * @param {string} title - The title of the invitation.
 * @param {string} description - The description of the invitation.
 * @param {string} text - The text of the invitation.
 * @return {Promise<void>} - A promise that resolves when the invitation is added.
 * @throws {Error} - If the user is not the club owner or if there was an error during the addition.
 */

const addMinute = async (clubownerId, id, title, description, text) => {
    try {
        const clubOwner = await User.findById(clubownerId).select('displayName');

        if (!clubOwner) {
            throw new Error('User must be the club owner to add minutes.');
        }

        await ClubPage.findOneAndUpdate(
            { clubOwner: clubOwner.displayName },
            {
                $push: {
                    minutes: {
                        id,
                        title,
                        description,
                        text
                    }
                }
            }
        );
    } catch (error) {
        console.error('Error adding minute:', error);
        throw new Error(error.message);
    }
};

/**
 * @author Lars Andreas Strand
 * @description This function deletes an invitation from a club.
 * It takes the clubownerId, invitationId, and clubId as input.
 * It first checks if the user is the club owner, and if not, it throws an error.
 * If the user is the club owner, it deletes the invitation from the club's invitations array.
 * If an error occurs, it logs the error and throws a new error with the error message.
 * @param {string} clubownerId - The ID of the club owner.
 * @param {string} minuteId - The ID of the minute to delete.
 * @param {string} clubId - The ID of the club.
 * @return {Promise<void>} - A promise that resolves when the minute is deleted.
 * @throws {Error} - If the user is not the club owner or if there was an error during the deletion.
 */

const deleteMinute = async (clubownerId, minuteId, clubId) => {
    try {
        const user = await User.findById(clubownerId).select('displayName');

        const club = await ClubPage.findOneAndUpdate(
            { clubOwner: user.displayName, _id: clubId },
            { $pull: { minutes: { id: minuteId } } },
            { new: true }
        );

        if (!club) {
            throw new Error('Club not found or user is not the club owner.');
        }

        return club.minutes;
    } catch (error) {
        console.error('Error deleting minute:', error);
        throw new Error(error.message);
    }
};

/**
 * @author Lars Andreas Strand
 * @description This function updates an invitation in a club.
 * It takes the clubownerId, invitationId, clubId, and request as input.
 * It first checks if the user is the club owner, and if not, it throws an error.
 * If the user is the club owner, it updates the invitation in the club's invitations array.
 * If an error occurs, it logs the error and throws a new error with the error message.
 * @param {string} userId - The ID of the user.
 * @param {string} minuteId - The ID of the minute to update.
 * @param {string} clubId - The ID of the club.
 * @param {Object} request - The request object containing the updated minute data.
 * @return {Promise<Array>} - A promise that resolves to the updated array of minutes.
 * @throws {Error} - If the user is not the club owner or if there was an error during the update.
 */

const updateMinute = async (userId, minuteId, clubId, request) => {
    try {
        if (!request) {
            throw new Error('Request object is undefined.');
        }

        const user = await User.findById(userId).select('displayName');

        const updateFields = {};
        if (request.title) updateFields['minutes.$[elem].title'] = request.title;
        if (request.description) updateFields['minutes.$[elem].description'] = request.description;
        if (request.text) updateFields['minutes.$[elem].text'] = request.text;

        const club = await ClubPage.findOneAndUpdate(
            { clubOwner: user.displayName, _id: clubId },
            { $set: updateFields },
            { arrayFilters: [{ 'elem.id': minuteId }], new: true }
        );

        if (!club) {
            throw new Error('Club not found or user is not the club owner.');
        }

        return club.minutes;
    } catch (error) {
        console.error('Error updating minute:', error);
        throw new Error(error.message);
    }
};

export { getMinutes, addMinute, deleteMinute, updateMinute };
