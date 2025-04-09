import * as clubpageService from '../services/clubpageService.js'

/**
 * @author Lars Andreas Strand
 * @description This file contains the controller functions for the club page routes.
 * It handles the requests and responses for the club page API endpoints.
 * It uses the clubpageService to interact with the database and perform CRUD operations on club pages.
 */

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get all club pages.'
 * It retrieves all club pages from the database and sends them as a response.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getAllClubPages = async (req, res) => {
  try {
    const response = await clubpageService.getAllClubPages()
    res.json({ mssg: 'List of all club pages', data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get a specific club page by ID.
 * It retrieves the club page from the database and sends it as a response.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getClubPage = async (req, res) => {
  try {
    const id = req.params.id
    const role = req.user.role
    const response = await clubpageService.getClubPage(id, role)
    res.json({ mssg: 'Club page found', data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get the view based on the user's role.
 * It checks the user's role and sends the appropriate view as a response.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getView = async (req, res) => {
  try {
    const role = req.user.role
    if (role === 'member') {
      res.json({ view: 'member' })
    } else res.json({ view: 'nonmember' })
  } catch (err) {
    res.status(404).json({ error: 'No role found' })
  }
}

const isMember = async (req, res) => {
  try {
    res.json({ isMember: req.user.role === "member" })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get the members of a club page.
 * It retrieves the members from the database and sends them as a response.
 * If the user is not a member, it sends an empty array as a response.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getMembers = async (req, res) => {
  try {
    const id = req.user.id
    const members = await clubpageService.getMembers(id)
    res.json(members)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get the announcements of a club page.
 * It retrieves the announcements from the database and sends them as a response.
 * If successful, it sends a 200 status code and the announcements.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getAnnouncements = async (req, res) => {
  try {
    const userId = req.user.id
    const announcements = await clubpageService.getAnnouncements(userId)
    res.json(announcements)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to create a new member for a club page.
 * It retrieves the user ID and club ID from the request parameters and the reason from the request body.
 * It first calls the service to add a new application for the member.
 * It then calls the service to create a new member.
 * If successful, it sends a 200 status code and a success message.
 * If there is an error, it sends a 500 status code and the error message.
 */

const createNewMember = async (req, res) => {
  try {
    const userId = req.user.id
    const clubId = req.params.clubId
    const { reason } = req.body

    await clubpageService.createNewApplication(
      userId,
      clubId,
      reason
    )

    await clubpageService.createNewMember(
      userId,
      clubId
    )

    res.status(200).json({ mssg: 'New member created' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to create a new club page.
 * It retrieves the club page data from the request body and calls the service to create a new club page.
 * If successful, it sends a 201 status code and a success message.
 * If there is an error, it sends a 500 status code and the error message.
 */

const createNewClubPage = async (req, res) => {
  try {
    const { name, clubOwner, description, address, zipCode, websiteURL, email, phone } = req.body

    await clubpageService.createNewClubPage(
      name,
      clubOwner,
      description,
      address,
      zipCode,
      websiteURL,
      email,
      phone
    )
    res.status(201).json({ mssg: 'New club page created' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to create a new announcement for a club page.
 * It retrieves the club ID from the request parameters and the announcement data from the request body.
 * It calls the service to create a new announcement.
 * If successful, it sends a 201 status code and a success message.
 * If there is an error, it sends a 500 status code and the error message.
 */

const createNewAnnouncement = async (req, res) => {
  try {
    const { clubId } = req.params
    const { text } = req.body

    await clubpageService.createNewAnnouncement(clubId, text)
    res.status(201).json({ mssg: 'New announcement created' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to delete a club page by ID.
 * It retrieves the ID from the request parameters and calls the service to delete the club page.'
 * If successful, it sends a 200 status code and a success message.
 * If there is an error, it sends a 404 status code and the error message.
 */

const deleteClubPage = async (req, res) => {
  try {
    const id = req.params.id
    const response = await clubpageService.deleteClubPage(id)
    res.status(200).json({ mssg: 'Club page deleted', data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to update an announcement for a club page.
 * It retrieves the club ID and index from the request parameters and the updated text from the request body.
 * It calls the service to update the announcement.
 * If successful, it sends a 200 status code and a success message.
 * If there is an error, it sends a 500 status code and the error message.
 */

const updateAnnouncement = async (req, res) => {
  try {
    const clubId = req.params.clubId
    const index = req.params.index
    const { text } = req.body
    const response = await clubpageService.updateAnnouncement(clubId, index, text)
    res.status(200).json({ mssg: response })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to update a club page by ID.
 * It retrieves the ID from the request parameters and the updated data from the request body.
 * It calls the service to update the club page.
 * If successful, it sends a 200 status code and a success message.
 * If there is an error, it sends a 500 status code and the error message.
 */

const updateClubPage = async (req, res) => {
  try {
    const id = req.params.id
    const request = req.body
    await clubpageService.updateClubPage(id, request)
    res.status(200).json({ mssg: 'Club page updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export {
  getAllClubPages,
  getClubPage,
  getView,
  isMember,
  getMembers,
  getAnnouncements,
  createNewMember,
  createNewClubPage,
  createNewAnnouncement,
  deleteClubPage,
  updateAnnouncement,
  updateClubPage
}
