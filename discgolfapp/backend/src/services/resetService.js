import User from '../models/User.js'
import ClubPage from '../models/Clubpage.js'
import Course from '../models/Course.js'
import Game from '../models/Game.js'

import bcrypt from 'bcrypt'

const resetTestData = async (userId) => {
    try {
        const user = await User.findById(userId).select('role');

        if (user && user.role === 'admin') {
            await User.deleteMany({});
            await ClubPage.deleteMany({});
            await Course.deleteMany({});
            await Game.deleteMany({});

            const adminPassword = bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            const clubownerPassword = bcrypt.hash(process.env.CLUBOWNER_PASSWORD, 10);
            const memberPassword = bcrypt.hash(process.env.MEMBER_PASSWORD, 10);
            const userPassword = bcrypt.hash(process.env.USER_PASSWORD, 10);

            await User.insertMany([
                { displayName: 'admin', email: 'admin@testmail.no', password: adminPassword, role: 'admin' },
                { displayName: 'klubbeier', email: 'klubbeier@testmail.no', password: clubownerPassword, role: 'clubowner' },
                { displayName: 'medlem', email: 'medlem@testmail.no', password: memberPassword, role: 'member' },
                { displayName: 'bruker', email: 'bruker@testmail.no', password: userPassword, role: 'user' },
            ]);

            await ClubPage.insertMany([
                {
                    name: 'Klubb A',
                    clubOwner: "klubbeier",
                    description: 'En klubb laget for testing',
                    address: 'Gullbringvegen 30',
                    zipCode: '3800',
                    websiteURL: 'www.usn.no',
                    email: 'test@usn.no',
                    phone: '12345678',
                    members: [
                        { displayName: 'klubbeier', role: 'clubowner' },
                        { displayName: 'medlem', role: 'member' },
                        { displayName: 'bruker', role: 'user' },
                    ],
                    announcements: [],
                    events: [],
                    applications: [],
                    invitations: [],
                    minutes: []
                },
                {
                    name: 'Klubb B',
                    clubOwner: "klubbeier",
                    description: 'En klubb laget for testing',
                    address: 'Gullbringvegen 30',
                    zipCode: '3800',
                    websiteURL: 'www.usn.no',
                    email: 'test@usn.no',
                    phone: '12345678',
                    members: [
                        { displayName: 'klubbeier', role: 'clubowner' },
                        { displayName: 'admin', role: 'admin' },
                    ],
                    announcements: [],
                    events: [],
                    applications: [],
                    invitations: [],
                    minutes: []
                },
            ]);

            await Course.insertMany([
                { name: 'Course A', holes: 18, location: 'Park A' },
                { name: 'Course B', holes: 9, location: 'Park B' }
            ]);

            console.log('Test data reset successfully.');
        }
        else {
            throw new Error('User is not an admin or does not exist');
        }
    } catch (error) {
        console.error('Error resetting test data:', error);
    }
};

export { resetTestData };
