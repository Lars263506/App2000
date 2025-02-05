import ClubPage from "../models/Clubpage.js";

const getNonmemberElements = async (id) => {
    const clubpage = await ClubPage.findById(id);
    let elements;

    if (clubpage) elements = clubpage.nonmemberElements;
    else throw new Error("No elements found for this club page");

    return elements;
}

const getMemberElements = async (id) => {
    const clubpage = await ClubPage.findById(id);
    let elements;

    if (clubpage) elements = clubpage.memberElements;
    else throw new Error("No elements found for this club page");

    return elements;
}

const createNewNonmemberElement = async (id, type, x, y, width, height) => {
    const newElement = { type, x, y, width, height};
    await ClubPage.updateOne(
        { _id: id}, 
        { $push: { nonmemberElements: newElement }}
    );
}

const createNewMemberElement = async (id, type, x, y, width, height) => {
    const newElement = { type, x, y, width, height};
    await ClubPage.updateOne(
        { _id: id}, 
        { $push: { memberElements: newElement }}
    );
}

const deleteElement = async (id) => {
    
}

const updateElement = async (id, request) => {
    
}

export { getNonmemberElements, getMemberElements, createNewNonmemberElement, createNewMemberElement, deleteElement, updateElement };
