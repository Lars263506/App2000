import ClubPage from '../models/Clubpage.js'
import User from '../models/User.js'

/**
 * @author Lars Andreas Strand
 * @description This service handles the club page related CRUD operations towards the MongoDB database.
 * It uses the ClubPage model to interact with the database.
 */

/**
 * @author Lars Andreas Strand
 * @description This function retrieves all club pages from the database.
 * @returns An array of all club pages in the database.
 * @throws An error if no club pages are found.
 */

const getAllClubPages = async () => {
  const excludeFields = ['clubOwner', '__v', 'createdAt', 'updatedAt', 'members', 'events', 'memberElements', 'nonmemberElements']

  const clubPages = await ClubPage.find({}).select(`-${excludeFields.join(' -')}`)
  if (!clubPages) throw new Error('No club pages found')
  return clubPages
}

/**
 * @author Lars Andreas Strand
 * @description This function retrieves a specific club page from the database.
 * @param {string} id - The ID of the club page to retrieve.
 * @return The club page object with the specified ID.
 */

const getClubPage = async (id) => {
  const excludeFields = ['__v', 'createdAt', 'updatedAt']

  const clubPage = await ClubPage.findById(id).select(`-${excludeFields.join(' -')}`)
  if (!clubPage) throw new Error('Club page not found')
  return clubPage
}

/**
 * @author Lars Andreas Strand
 * @description This function retrieves a specific club page from the database.
 * @param {string} id - The ID of the user to retrieve the member list for.
 * @return A list of members in the club page.
 * @throws An error if the user is not found or if the club page is not found.
 */

const getMembers = async (id) => {
  const user = await User.findById(id).select('displayName')
  if (!user) throw new Error('User not found')

  const clubPage = await ClubPage.findOne({ 'members.displayName': user.displayName }).select('members')
  if (!clubPage) return []

  return clubPage.members
}

/**
 * @author Lars Andreas Strand
 * @description This function retrieves the announcements from the club page.
 * @param {string} id - The ID of the user to retrieve the announcements for.
 * @return A list of announcements in the club page.
 * @throws An error if the user is not found or if the club page is not found.
 *
 */

const getAnnouncements = async (id) => {
  const user = await User.findById(id).select('displayName')
  if (!user) throw new Error('User not found')

  const clubPage = await ClubPage.findOne({ 'members.displayName': user.displayName }).select('announcements')
  if (!clubPage) return []

  return clubPage.announcements
}

const createNewApplication = async (userId, clubId, reason) => {
  const user = await User.findById(userId).select('displayName email')
  if (!user) throw new Error('User not found')

  const application = {
    displayName: user.displayName,
    email: user.email,
    reason,
    status: 'pending',
    date: new Date()
  }

  await ClubPage.findByIdAndUpdate(
    clubId,
    { $push: { applications: application } },
    { new: true }
  )
}

/**
 * @author Lars Andreas Strand
 * @description This function creates a new member in the club page.
 * @param {string} clubId - The ID of the club page to add the member to.
 * @param {string} userId - The ID of the user to add as a member.
 * @return The updated club page object.
 * @throws An error if the user is not found
 */

const createNewMember = async (userId, clubId) => {
  const user = await User.findById(userId).select('displayName profilePicture')
  if (!user) throw new Error('User not found when creating new member')

  const member = {
    displayName: user.displayName,
    role: 'member',
    profilePicture: user.profilePicture
  }

  await ClubPage.findByIdAndUpdate(
    clubId,
    { $push: { members: member } },
    { new: true }
  )
}

/**
 * @author Lars Andreas Strand
 * @description This function creates a new club page in the database.
 * @param {string} name - The name of the club page.
 * @param {string} clubOwner - The owner of the club page's display name.
 * @param {string} description - The description of the club page.
 * @param {string} address - The address of the club page.
 * @param {string} zipCode - The zip code of the club page.
 * @param {string} websiteURL - The website URL of the club page.
 * @param {string} email - The email of the club page.
 * @param {string} phone - The phone number of the club page.
 * @returns The created club page object.
 * @throws An error if the club page with the same name already exists or if there is an error creating the club page.
 * @throws An error if the club page is not found.
 */

const createNewClubPage = async (name, clubOwner, description, address, zipCode, websiteURL, email, phone) => {
  const newClubPage = {
    name,
    clubOwner,
    description,
    address,
    zipCode,
    websiteURL,
    email,
    phone,
    members: [],
    events: []
  }

  try {
    const createdClubPage = await ClubPage.create(newClubPage)
    return createdClubPage
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Club page with this name already exists')
    } else {
      throw new Error('Error creating club page')
    }
  }
}

const createNewAnnouncement = async (clubId, text) => {
  await ClubPage.findByIdAndUpdate(
    clubId,
    { $push: { announcements: text } },
    { new: true }
  )
}

/**
 * @author Lars Andreas Strand
 * @description This function deletes a specific club page from the database.
 * @param {string} id - The ID of the club page to delete.
 * @returns The deleted club page object.
 * @throws An error if the club page is not found.
 */

const deleteClubPage = async (id) => {
  const clubPage = await ClubPage.findByIdAndDelete(id)
  if (!clubPage) throw new Error('Club page not found')
  return clubPage
}

/**
 * @author Lars Andreas Strand
 * @description This function updates a specific announcement in the club page.
 * It checks if the text is empty and either deletes the announcement or updates it.
 * @param {string} clubId - The ID of the club page.
 * @param {number} index - The index of the announcement to update.
 * @param {string} text - The new text for the announcement.
 * @returns A message indicating the result of the update operation.
 */

const updateAnnouncement = async (clubId, index, text) => {
  if (text === '') {
    await ClubPage.findByIdAndUpdate(
      clubId,
      {
        $unset: { [`announcements.${index}`]: 1 },
      },
      { new: true }
    );

    await ClubPage.findByIdAndUpdate(
      clubId,
      {
        $pull: { announcements: null },
      },
      { new: true }
    );

    return 'Announcement deleted';
  }

  await ClubPage.findByIdAndUpdate(
    clubId,
    { $set: { [`announcements.${index}`]: text } },
    { new: true }
  );

  return 'Announcement updated';
};

/**
 * @author Lars Andreas Strand
 * @description This function updates a specific club page in the database.
 * @param {string} id - The ID of the club page to update.
 * @param {object} request - The request body containing the updated club page data.
 * @return The updated club page object.
 * @throws An error if the club page is not found.
 */

const updateClubPage = async (id, request) => {
  const clubPage = await ClubPage.findByIdAndUpdate(id, request, { new: true })
  if (!clubPage) throw new Error('Club page not found')
}

export {
  getAllClubPages,
  getClubPage,
  getMembers,
  getAnnouncements,
  createNewApplication,
  createNewMember,
  createNewClubPage,
  createNewAnnouncement,
  deleteClubPage,
  updateAnnouncement,
  updateClubPage
}
