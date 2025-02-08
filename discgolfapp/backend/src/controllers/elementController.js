import mongoose from 'mongoose';
import * as elementService from '../services/elementService.js';

/**
 * @author Lars Andreas Strand og Adrian Johansen
 * @description Controller for elements
 */

/**
 * @param req 
 * @param res
 * @description Gets elements from the database by club id and role
 * @throws Error if no elements were found
 */

const getElements = async (req, res) => {
    try {
        const id = req.params.id;
        const role = req.user.role;
        const elements = await elementService.getElements(id, role);
        res.status(200).json(elements);
    } catch(error) {
        res.status(404).json({ message: error.message });
    }
}

/**
 * @param req 
 * @param res
 * @description Creates a new element in the database
 * @throws Error if there was an error creating the element in the database
 */

const createNewElement = async (req, res) => {
    try {
        const id = req.params.id;
        const { type, uniqueId, x, y, width, height, view } = req.body
        const createdAt = await elementService.createNewElement(id, type, uniqueId, x, y, width, height, view);
        res.status(201).json(createdAt);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @param req 
 * @param res
 * @description Deletes an element from the database by club id, view and element id
 * @throws Error if there was an error deleting the element from the database
 */

const deleteElement = async (req, res) => {
    try {
        const clubId = req.params.id;
        const { view, uniqueId } = req.body;

        const success = await elementService.deleteElement(clubId, view, uniqueId);
        res.status(200).json(success);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}

/**
 * @param req 
 * @param res
 * @description Updates an element in the database by first creating a new element and then deleting the old element
 * @throws Error if there was an error updating the element in the database
 */

const updateElement = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const id = req.params.id;
        const { type, uniqueId, x, y, width, height, view } = req.body

        await elementService.deleteElement(id, view, uniqueId);

        await elementService.createNewElement(id, type, uniqueId, x, y, width, height, view);
        
        await session.commitTransaction();

        res.status(200).json({ success: true });
    } catch(error) {
        res.status(400).json({ message: error.message });
        session.abortTransaction();
    } finally {
        session.endSession();
    }
}

export { getElements, createNewElement,  deleteElement, updateElement };
