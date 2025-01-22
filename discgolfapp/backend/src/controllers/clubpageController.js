import * as clubpageService from '../services/clubpageService.js';

const getAllClubPages = async (req, res) => {
    try {
        const response = await clubpageService.getAllClubPages();
        res.json({mssg: "List of all club pages", data: response});
    } catch (err) {
        res.status(404).json({error: err.message});
    }
};

const getClubPage = async (req, res) => {
    try {
        const id = req.params.id;
        const role = req.user.role;
        const response = await clubpageService.getClubPage(id, role);
        res.json({mssg: "Club page found", data: response});
    } catch (err) {
        res.status(404).json({error: err.message});
    }
};

const createNewClubPage = async (req, res) => {
    try {
        const { name, clubOwner, description, address, zipCode, websiteURL, email, phone } = req.body;

        const response = await clubpageService.createNewClubPage(
            name, 
            clubOwner, 
            description, 
            address, 
            zipCode,
            websiteURL, 
            email, 
            phone
        );
        res.json({mssg: "Club page has been created", data: response});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const deleteClubPage = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await clubpageService.deleteClubPage(id);
        res.json({mssg: "Club page deleted", data: response});
    } catch (err) {
        res.status(404).json({error: err.message});
    }
};

const updateClubPage = async (req, res) => {
    try {
        const id = req.params.id;
        const request = req.body;
        await clubpageService.updateClubPage(id, request);
        res.json({mssg: "Club page has been updated"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export { getAllClubPages, getClubPage, createNewClubPage, deleteClubPage, updateClubPage };
