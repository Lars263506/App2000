import ClubPage from '../models/Clubpage.js';
import User from '../models/User.js';

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
