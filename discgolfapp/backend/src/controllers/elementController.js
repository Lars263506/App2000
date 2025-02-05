import * as elementService from '../services/elementService.js';

const getNonmemberElements = async (req, res) => {
    try {
        const id = req.params.id;
        const element = await elementService.getNonmemberElements(id);
        res.status(200).json(element);
    } catch(error) {
        res.status(404).json({ message: error.message });
    }
}

const getMemberElements = async (req, res) => {
    try {
        const id = req.params.id;
        const element = await elementService.getMemberElements(id);
        res.status(200).json(element);
    } catch(error) {
        res.status(404).json({ message: error.message });
    }
}

const createNewNonmemberElement = async (req, res) => {
    try {
        const id = req.params.id;
        const { type, x, y, width, height } = req.body
        const createdAt = await elementService.createNewNonmemberElement(id, type, x, y, width, height);
        res.status(201).json(createdAt);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const createNewMemberElement = async (req, res) => {
    try {
        const id = req.params.id;
        const { type, x, y, width, height } = req.body
        const createdAt = await elementService.createNewMemberElement(id, type, x, y, width, height);
        res.status(201).json(createdAt);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteElement = async (req, res) => {
    try {
        const id = req.params.id;
        const success = await elementService.deleteElement(id);
        res.status(200).json(success);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}

const updateElement = async (req, res) => {
    try {
        const id = req.params.id;
        const success = await elementService.updateElement(id, req.body);
        res.status(200).json(success);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}

export { getNonmemberElements, getMemberElements, createNewNonmemberElement, createNewMemberElement,  deleteElement, updateElement };
