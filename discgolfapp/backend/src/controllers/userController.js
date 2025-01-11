import * as userService from '../services/userService.js';

/**
 * @author Lars263506 (Github)
 * @description This controller contains request handlers for user registration, authentication and user data management
 */

/**
 * 
 * @param req 
 * @param res
 * @description Gets a user from the database by id
 * @throws Error if the user was not found
 */

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getUser(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

/**
 * 
 * @param req 
 * @param res
 * @description Gets a user from the database by email
 * @throws Error if the user was not found
 */

const getUserByEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await userService.getUserByEmail(email);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

/**
 * 
 * @param req 
 * @param res
 * @description Registers a new user in the database
 * @throws Error if there was an error registering the user in the database
 */

const registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const newUser = await userService.registerUser(email, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * 
 * @param req 
 * @param res
 * @description Logs in a user and tokens are created for the user
 * @throws Error if the email or password is incorrect
 */

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { userEmail, accessToken, refreshToken } = await userService.loginUser(email, password);
        res.status(200).json({ userEmail, accessToken, refreshToken });
    } catch (error) {
        res.status(error.statusCode).json({ error: error.message });
    }
}

/**
 * 
 * @param req 
 * @param res
 * @description Logs out a user and invalidates the refresh token
 * @throws Error if there was an error logging out the user
 */

const logoutUser = async (res) => {
    try {
        const expiredTokens = await userService.logoutUser(token);
        res.status(200).json({ expiredTokens });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * 
 * @param req 
 * @param res
 * @description Changes the email of a user in the database
 * @throws Error if there was an error changing the email in the database
 */

const changeEmail = async (req, res) => {
    const { email, newEmail } = req.body;
    try {
        const user = await userService.changeEmail(email, newEmail);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * 
 * @param req 
 * @param res
 * @description Changes the password of a user in the database
 * @throws Error if there was an error changing the password in the database
 */

const changePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await userService.changePassword(email, newPassword);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * 
 * @param req 
 * @param res
 * @description Deletes a user from the database
 * @throws Error if there was an error deleting the user from the database
 */

const deleteUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userService.deleteUser(email);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export { getUser, getUserByEmail, registerUser, loginUser, logoutUser, changeEmail, changePassword, deleteUser };