import ClubPage from "../models/Clubpage.js";

/**
 * @author Lars Andreas Strand og Adrian Johansen
 * @description This service contains functions for managing elements in the database.
 * @disclaimer The MQL queries in this file are somewhat inspired by Copilot's suggestions.
 */

/**
 * @param req 
 * @param res
 * @description Gets elements from the database by club id and role
 * @throws Error if no elements were found
 */

const getElements = async (id, role) => {
    const clubpage = await ClubPage.findById(id);
    if (!clubpage) throw new Error("Invalid club id");

    let elements = {
        nonmemberElements: [],
        memberElements: [],
    };
    
    if (role == "clubowner") {
        elements.memberElements = clubpage.memberElements;
        elements.nonmemberElements = clubpage.nonmemberElements;
    }
 
    else if (role == "member") elements.memberElements = clubpage.memberElements;
    
    else elements.nonmemberElements = clubpage.nonmemberElements;

    return elements;
}

/**
 * @param req 
 * @param res
 * @description Creates a new element in the database
 * @throws Error if there was an error creating the element in the database
 * @disclosure $push was suggested by Copilot
 */

const createNewElement = async (id, type, uniqueId, x, y, width, height, view) => {
    const newElement = { type, uniqueId, x, y, width, height};

    if (view == "member")  
        await ClubPage.updateOne(
            { _id: id}, 
            { $push: { memberElements: newElement }}
        );

    else 
        await ClubPage.updateOne(
            { _id: id}, 
            { $push: { nonmemberElements: newElement }}
        );
}

/**
 * @param req 
 * @param res
 * @description Deletes an element from the database by club id, view and element id
 * @throws Error if there was an error deleting the element from the database
 * @disclosure $pull was suggested by Copilot
 */

const deleteElement = async (clubId, view, uniqueId) => {
    if (view == "member")  
        return await ClubPage.updateOne(
            {_id: clubId},
            {$pull: { memberElements: { uniqueId: uniqueId } }}
        );
    else
        return await ClubPage.updateOne(
            {_id: clubId},
            {$pull: { nonmemberElements: { uniqueId: uniqueId } }}
        );
}

export { getElements, createNewElement, deleteElement };
