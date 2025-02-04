import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @author Lars263506 (Github)
 * @description This service contains functions for user registration, authentication and user data management, and handles mongoDB communication
 */

/**
 * @param id
 * @returns User object, excluding hashed password
 * @description Gets a user from the database by id
 * @throws Error if the user was not found
 */

const getUser = async (id) => {
    const user = await User.findById(id).select('-hashedPassword');
    if (!user) throw new Error("User not found");
    return user;
};

/**
 * @param email
 * @returns User object, excluding hashed password
 * @description Gets a user from the database by email
 * @throws Error if the user was not found
 */

const getUserByEmail = async (email) => {
    const user = await User.find({ email }).select('-hashedPassword');
    if (!user) throw new Error("User not found");
    return user;
};

/**
 * 
 * @param email 
 * @param password 
 * @returns Time of user creation
 * @description Registers a new user in the database
 * @throws Error if there was an error registering the user in the database
 */

const registerUser = async (displayName, email, password) => {
    let hashedPassword;
    let exists = false;

    do {
        hashedPassword = await bcrypt.hash(password, 10);
        exists = await User.findOne({ hashedPassword});
    } while (exists);

    const changedTime = new Date();
    const newUser = { 
        displayName,
        email,
        hashedPassword,
        role: 'user',
        emailChangedAt: changedTime, 
        passwordChangedAt: changedTime,
        roleChangedAt: changedTime
    };
    let user;
    try {
        user = await User.create(newUser);
    } catch (error) {
        throw new Error("Email is already in use");
    }
    return {createdAt: user.createdAt };
};

/**
 * @param email
 * @param password
 * @returns accessToken and refreshToken
 * @description Logs in a user and tokens are created for the user
 * @throws Error if the email or password is incorrect
 */

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    let passwordIsValidated = false;
    if (user) {
        passwordIsValidated = await bcrypt.compare(password, user.hashedPassword);
    };
    
    if (!passwordIsValidated) throw new Error("Incorrect email or password");

    const payload = { id: user._id, role: user.role };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken, displayName: user.displayName };
};

/**
 * @returns Object containing expired access token and refresh token
 * @description Logs out a user by creating expired tokens to invalidate the current tokens
 */

const logoutUser = async () => {
        const expiredAccessToken = jwt.sign({}, process.env.JWT_ACCESS_SECRET, { expiresIn: '1ms' });
        const expiredRefreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET, { expiresIn: '1ms' });

        if (!expiredAccessToken || !expiredRefreshToken) {
            throw new Error("Error creating expired tokens and logging out user");
        }

        return { expiredAccessToken, expiredRefreshToken };
};

/**
 * @param email
 * @param displayName
 * @returns Time of display name change
 * @description Changes the display name of a user in the database
 */

const changeDisplayName = async (email, newDisplayName) => {
    const user = await User.findOneAndUpdate({ email }, { displayName: newDisplayName }, { new: true });
    if (!user) throw new Error("User not found");

    return { emailChangedAt: user.emailChangedAt };
};

/**
 * @param email
 * @param newEmail
 * @returns Time of email change
 * @description Changes the email of a user in the database
 */

const changeEmail = async (email, newEmail) => {
    const user = await User.findOneAndUpdate({ email }, { email: newEmail }, { new: true });
    if (!user) throw new Error("User not found");

    return { emailChangedAt: user.emailChangedAt };
};

/**
 * 
 * @param email 
 * @param newPassword 
 * @returns Time of password change
 * @description Changes the password of a user in the database
 */

const changePassword = async (email, newPassword) => {
    newPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
    if (!user) throw new Error("User not found");

    return { passwordChangedAt: user.passwordChangedAt };
};

/**
 * 
 * @param email 
 * @param newRole 
 * @returns New user role and time of role change
 * @description Changes the role of a user in the database
 */

const changeRole = async (email, newRole) => {
    const user = User.findOneAndUpdate({ email }, { role: newRole });

    if (!user) throw new Error("User not found");

    return { role: user.role, roleChangedAt: user.roleChangedAt};
};

/**
 * @param email
 * @returns Whether the user was deleted or not
 * @description Deletes a user from the database
 */

const deleteUser = async (email) => {
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) throw new Error("User not found");
    return { success: true };
};

export { 
    getUser, 
    getUserByEmail, 
    registerUser, 
    loginUser, 
    logoutUser, 
    changeDisplayName, 
    changeEmail, 
    changePassword, 
    changeRole, 
    deleteUser 
};
