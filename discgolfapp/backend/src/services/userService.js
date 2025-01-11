import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * @author Lars263506 (Github)
 * @description This service contains functions for user registration, authentication and user data management, and handles mongoDB communication
 */

/**
 * @param id
 * @returns User object, excluding sensitive and internal properties
 * @description Gets a user from the database by id
 * @throws Error if the user was not found
 */

const getUser = async (id) => {
    const user = await User.findById(id).select('-hashedPassword -emailChangedAt -passwordChangedAt -__v');
    if (!user) throw new Error("User not found");
    return user;
};

/**
 * @param email
 * @returns User object, excluding sensitive and internal properties
 * @description Gets a user from the database by email
 * @throws Error if the user was not found
 */

const getUserByEmail = async (email) => {
    const user = await User.find({ email }).select('-hashedPassword -emailChangedAt -passwordChangedAt -__v');
    if (!user) throw new Error("User not found");
    return user;
};

/**
 * 
 * @param email 
 * @param password 
 * @returns New user object with email and createdAt properties
 * @description Registers a new user in the database
 * @throws Error if there was an error registering the user in the database
 */

const registerUser = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const changedTime = new Date();
    const newUser = { email, hashedPassword, emailChangedAt: changedTime, passwordChangedAt: changedTime };
    let user;
    try {
        user = await User.create(newUser);
    } catch (error) {
        throw new Error("Email is already in use");
    }
    return { email: user.email, createdAt: user.createdAt };
};

/**
 * @param email
 * @param password
 * @returns Object containing the user object, access token and refresh token
 * @description Logs in a user and tokens are created for the user
 * @throws Error if the email or password is incorrect
 */

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    let passwordIsValidated = false;
    if (user) {
        passwordIsValidated = await bcrypt.compare(password, user.hashedPassword);
    };
    
    if (!passwordIsValidated) {
        const error = new Error("Incorrect email or password");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { userEmail: user.email, accessToken, refreshToken };
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
 * @param newEmail
 * @returns User object with updated email
 * @description Changes the email of a user in the database
 */

const changeEmail = async (email, newEmail) => {
    const user = await User.findOneAndUpdate({ email }, { email: newEmail }, { new: true });
    if (!user) throw new Error("User not found");

    user.email = newEmail;
    return { email: user.email, emailChangedAt: user.emailChangedAt };
};

/**
 * 
 * @param email 
 * @param newPassword 
 * @returns User object with email and createdAt properties
 * @description Changes the password of a user in the database
 */

const changePassword = async (email, newPassword) => {
    newPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
    if (!user) throw new Error("User not found");

    return { email: user.email, passwordChangedAt: user.passwordChangedAt };
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

export { getUser, getUserByEmail, registerUser, loginUser, logoutUser, changeEmail, changePassword, deleteUser };