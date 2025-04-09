import * as settingsService from '../services/settingsService.js'

/**
 * @author Lars Andreas Strand
 * @description This file contains the controller functions for the settings routes.
 */

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get settings for a user.
 * It retrieves the settings from the database and sends them as a response.
 * If successful, it sends a 200 status code and the settings data.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getSettings = async (req, res) => {
  try {
    res.status(200).json(await settingsService.getSettings(req.user.id))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to grant settings to an admin.
 * It retrieves the admin's display name and the setting to grant from the request body and grants them to the admin.
 * If successful, it sends a 200 status code and the granted settings data.
 * If there is an error, it sends a 404 status code and the error message.
 * If the display name or setting is missing, it sends a 400 status code and an error message.
 */

const grantSetting = async (req, res) => {
  const { displayName, setting } = req.body
  if (!displayName || !setting) {
    return res.status(400).json({ message: 'Display name and setting are required' })
  }

  try {
    res.status(200).json(await settingsService.grantSetting(displayName, setting))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to revoke settings from an admin.
 * It retrieves the admin's ID and the setting to revoke from the request body and revokes them from the admin.
 * If successful, it sends a 200 status code and the revoked settings data.
 * If there is an error, it sends a 404 status code and the error message.
 * If the display name or setting is missing, it sends a 400 status code and an error message.
 */

const revokeSetting = async (req, res) => {
  const { displayName, setting } = req.body

  if (!displayName || !setting) {
    return res.status(400).json({ message: 'Display name and setting are required' })
  }

  try {
    res.status(200).json(await settingsService.revokeSetting(displayName, setting))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export { getSettings, grantSetting, revokeSetting }
