import * as settingsService from '../services/settingsService.js'

/**
 * @author Lars Andreas Strand
 * @description Controller for settings
 */

/**
 * @param req
 * @param res
 * @description Gets settings for admins
 * @throws Error if no settings were found for the admin
 */

const getSettings = async (req, res) => {
  try {
    res.status(200).json(await settingsService.getSettings(req.user.id))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description gives settings to the admin
 * @throws Error if no settings were found for the admin
 */

const grantSetting = async (req, res) => {
  try {
    res.status(200).json(await settingsService.grantSetting(req.user.id, req.body.setting))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description gives settings to the admin
 * @throws Error if no settings were found for the admin
 */

const revokeSetting = async (req, res) => {
  try {
    res.status(200).json(await settingsService.revokeSetting(req.user.id, req.body.setting))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export { getSettings, grantSetting, revokeSetting }
