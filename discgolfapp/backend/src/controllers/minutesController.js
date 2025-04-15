import * as minutesService from '../services/minutesService.js';

const getMinutes = async (req, res) => {
    try {
        const userId = req.user.id;
        const minutes = await minutesService.getMinutes(userId);
        res.status(200).json(minutes);
    } catch (error) {
        console.error('Error fetching minutes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const addMinute = async (req, res) => {
    try {
        const clubownerId = req.user.id;
        const { id, title, description, text } = req.body;
        const minute = await minutesService.addMinute(clubownerId, id, title, description, text);
        res.status(201).json(minute);
    } catch (error) {
        console.error('Error adding minute:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteMinute = async (req, res) => {
    try {
        const clubownerId = req.user.id;
        const { minuteId, clubId } = req.body;
        await minutesService.deleteMinute(clubownerId, minuteId, clubId);
        res.status(200).send();
    } catch (error) {
        console.error('Error deleting minute:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateMinute = async (req, res) => {
    try {
        const clubownerId = req.user.id;
        const { minuteId, clubId, request } = req.body;
        const updatedMinute = await minutesService.updateMinute(clubownerId, minuteId, clubId, request);
        res.status(200).json(updatedMinute);
    } catch (error) {
        console.error('Error updating minute:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { getMinutes, addMinute, deleteMinute, updateMinute };
