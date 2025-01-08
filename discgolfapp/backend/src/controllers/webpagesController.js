import * as webpageService from '../services/webpageService.js';

const getAllWebpages = async (req, res) => {
    try {
        const response = await webpageService.getAllWebpages();
        res.json({mssg: "Gets all webpages", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

const getWebpage = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await webpageService.getWebpage(id);
        res.json({mssg: "Gets a single webpage", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

const createNewWebpage = async (req, res) => {
    try {
        const response = await webpageService.createNewWebpage(); //Implementation: Add simple parameters (not request)
        res.json({mssg: "Creates a brand new webpage", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

const deleteWebpage = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await webpageService.deleteWebpage(id);
        res.json({mssg: "Deletes a webpage", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

const updateWebpage = async (req, res) => {
    try {
        const response = await webpageService.updateWebpage(); //Implementation: Add simple parameters (not request)
        res.json({mssg: "Updates a webpage", data: response});
    } catch (err) {
        res.status(501).json({error: err.message});
    }
};

export { getAllWebpages, getWebpage, createNewWebpage, deleteWebpage, updateWebpage };
