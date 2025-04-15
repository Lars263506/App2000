import User from '../models/User.js'
import ClubPage from '../models/Clubpage.js'
import Course from '../models/Course.js'
import Game from '../models/Game.js'

import bcrypt from 'bcrypt'

const resetTestData = async (userId) => {
    const user = await User.findById(userId).select('role');

    if (!user || user.role !== 'admin') {
        throw new Error('User is not an admin or does not exist');
    }

    const userDeleteResult = await User.deleteMany({});
    const clubPageDeleteResult = await ClubPage.deleteMany({});
    const courseDeleteResult = await Course.deleteMany({});
    const gameDeleteResult = await Game.deleteMany({});

    console.log('Deleted users:', userDeleteResult?.deletedCount || 0);
    console.log('Deleted club pages:', clubPageDeleteResult?.deletedCount || 0);
    console.log('Deleted courses:', courseDeleteResult?.deletedCount || 0);
    console.log('Deleted games:', gameDeleteResult?.deletedCount || 0);

    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const clubownerPassword = await bcrypt.hash(process.env.CLUBOWNER_PASSWORD, 10);
    const memberPassword = await bcrypt.hash(process.env.MEMBER_PASSWORD, 10);
    const userPassword = await bcrypt.hash(process.env.USER_PASSWORD, 10);

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
        {
            name: 'USN Campus Bø Skolebane',
            courseOwner: 'klubbeier',
            location: 'Gullbringvegen 36',
            town: 'Bø i Telemark',
            postCode: '3800',
            url: 'http://usn.no',
            latitude: 59.24338,
            longitude: 9.03309,
            difficulty: 'Medium',
            familyFriendly: false,
            holes: 9,
            pins: [],
            lines: [],
            reviews: [],
        },
        {
            name: 'Skien Frisbeegolfbane',
            courseOwner: 'admin',
            location: 'Moflatvegen 67',
            town: 'Skien',
            postCode: '3733',
            url: 'http://skien.no',
            latitude: 59.11062,
            longitude: 9.35498,
            difficulty: 'Difficult',
            familyFriendly: true,
            holes: 21,
            pins: "",
            lines: JSON.stringify([
                { id: 1, startPin: 1, endPin: 2 },
            ]),
            reviews: [],
        },
    ]);
};

export { resetTestData };
