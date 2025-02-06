import ClubPage from "../models/Clubpage.js";

/**
 * @author Lars Andreas Strand og Adrian Johansen
 * @description This service contains functions for managing elements in the database. 
 */

const getElements = async (id, role) => {
    const clubpage = await ClubPage.findById(id);
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

const createNewElement = async (id, view, type, x, y, width, height) => {
    const newElement = { type, x, y, width, height};

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

const deleteElement = async (clubId, view, elementId) => {

    if (view == "member")  
        return await ClubPage.deleteOne(
            {_id:clubId},
            {$pull: { memberElements, elementId }}
        );

    else
        return await ClubPage.deleteOne(
            {_id:clubId},
            {$pull: { nonmemberElements, elementId }}
        );
    }


/* const updateElement = async (clubId, view, request, elementId) => {

    if (view == "member")
        await clubpage.updateOne(
            {_id:clubId},
            {
                "$set": {  
                        "memberElements.$": {_id:elementId, ...request} 
                }
            },
            { new:true}
        );
        
    
}
*/

export { getElements, createNewElement,  deleteElement };
