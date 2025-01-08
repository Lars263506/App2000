import * as userService from '../services/userService.js';

const getAllUsers = async (req, res) => {
    try {
        const response = await userService.getAllUsers();
        res.json({mssg: "Gets all users", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await webpageService.getWebpage(id);
        res.json({mssg: "Gets a single webpage", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

const createUser = async (req, res) => {
    try {
        const response = await webpageService.createNewWebpage(); //Implementation: Add simple parameters (not request)
        res.json({mssg: "Creates a brand new webpage", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await webpageService.deleteWebpage(id);
        res.json({mssg: "Deletes a webpage", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

const updateUser = async (req, res) => {
    try {
        const response = await webpageService.updateWebpage(); //Implementation: Add simple parameters (not request)
        res.json({mssg: "Updates a webpage", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

export { getAllUsers, getUser, createUser, deleteUser, updateUser };
