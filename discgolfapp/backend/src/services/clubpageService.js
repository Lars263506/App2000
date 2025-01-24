import ClubPage from "../models/Clubpage.js";

const getAllClubPages = async () => {
    const excludeFields = ["_id", "clubOwner", "__v", "createdAt", "updatedAt", "members", "events", "memberElements", "nonmemberElements"];

    const clubPages = await ClubPage.find({}).select(`-${excludeFields.join(" -")}`);
    if (!clubPages) throw new Error("No club pages found");
    return clubPages;
};

const getClubPage = async (id, role) => {
    const excludeFields = ["__v", "createdAt", "updatedAt"];

    if (role === "user") {
        excludeFields.push("members", "events", "memberElements");
    }
    else if (role === "member") {
        excludeFields.push("nonmemberElements");
    }

    const clubPage = await ClubPage.findById(id).select(`-${excludeFields.join(" -")}`);
    if (!clubPage) throw new Error("Club page not found");
    return clubPage;
};

const createNewClubPage = async (name, clubOwner, description, address, zipCode, websiteURL, email, phone, ) => {
    const newClubPage = {
        name,
        clubOwner,
        description,
        nonmemberElements: [],
        memberElements: [],
        address,
        zipCode,
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
