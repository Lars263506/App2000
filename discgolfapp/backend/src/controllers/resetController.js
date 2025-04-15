import * as resetService from '../services/resetService.js';

const resetTestData = async (req, res) => {
    try {
        if (req.user) {
            await resetService.resetTestData(req.user.id);
            res.status(200).json({ message: 'Test data reset successfully' });
        }
        else {
            res.status(403).json({ message: 'Forbidden' });
        }
    } catch (error) {
        console.error('Error resetting test data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { resetTestData };
