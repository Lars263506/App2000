import * as elementService from '../services/elementService.js';

/**
 * @author Lars Andreas Strand og Adrian Johansen
 * @description Controller for elements
 */

const getElements = async (req, res) => {
    try {
        const id = req.params.id;
        const role = req.user.role; 
        if (!role) role = "user"; 
        const element = await elementService.getElements(id, role);
        res.status(200).json(element);
    } catch(error) {
        res.status(404).json({ message: error.message });
    }
}

const createNewElement = async (req, res) => {
    try {
        const id = req.params.id;
        const { role, type, x, y, width, height } = req.body
        const createdAt = await elementService.createNewElement(id, role, type, x, y, width, height);
        res.status(201).json(createdAt);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteElement = async (req, res) => {
    try {
        const clubId = req.params.clubid;
        const role = req.params.role;
        const elementId = req.params.elementid;

        const success = await elementService.deleteElement(clubId, role, elementId);
        res.status(200).json(success);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}

const updateElement = async (req, res) => {
    try {
        const id = req.params.id;
        const { role, type, x, y, width, height, elementId } = req.body
        const createdAt = await elementService.createNewElement(id, role, type, x, y, width, height);

        if (createdAt) await elementService.deleteElement(id, role, elementId);
        res.status(200).json(success);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}

export { getElements, createNewElement,  deleteElement, updateElement };
