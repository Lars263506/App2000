import ClubPage from "../models/clubpage.js";

const getAllClubPages = async () => {
    const clubPages = await ClubPage.find({});
    if (!clubPages) throw new Error("No club pages found");
    return clubPages;
};

const getClubPage = async (id) => {
    const clubPage = await ClubPage.findById(id);
    if (!clubPage) throw new Error("Club page not found");
    return clubPage;
};

const createNewClubPage = async (name, clubOwner, description, address, websiteURL, email, phone, ) => {
    const newClubPage = {
        name,
        clubOwner,
        description,
        nonmemberElements: [],
        memberElements: [],
        address,
        websiteURL,
        email,
        phone,
        members: [],
        events: []
    };

    let clubPage;
    try {
        clubPage = await ClubPage.create(newClubPage);
    } catch (error) {
        throw new Error("Error creating club page");
    }
    return clubPage;
};

const deleteClubPage = async (id) => {
    const clubPage = await ClubPage.findByIdAndDelete(id);
    if (!clubPage) throw new Error("Club page not found");
    return clubPage;
};

const updateClubPage = async (id, request) => {
    const clubPage = await ClubPage.findByIdAndUpdate(id, request, { new: true });
    if (!clubPage) throw new Error("Club page not found");
};

export { getAllClubPages, getClubPage, createNewClubPage, deleteClubPage, updateClubPage };
