import User from '../models/User.js'

/**
 * @author Lars Andreas Strand
 * @description Service for settings

/**
 * @returns List of settings for the user
 * @param admin
 * @description Gets all settings available to logged in admin user.
 * @throws Error if no settings
 */

const getSettings = async (admin) => {

    if (!admin) {
        throw new Error('No admin found.')
    }

    const settings = await User.find({ admin }).select('settings')

    if (!settings) {
        throw new Error('No settings found on this user. Ask superadmin for access.')
    }

    return settings
}

/**
 * @returns Whether the setting was granted or not
 * @param admin
 * @param setting
 * @description Grants a setting to the admin user
 * @throws Error if no admin found
 * @throws Error if setting could not be granted
 */

const grantSetting = async (admin, setting) => {

    if (!admin) {
        throw new Error('No admin found.')
    }

    const success = await User.findByIdAndUpdate({ admin }, { $push: { settings: setting } })

    if (!success) {
        throw new Error('Could not grant setting.')
    }

    return success
}

/**
 * @returns Whether the setting was revoked or not
 * @param admin
 * @param setting
 * @description Revokes a setting from the admin user
 * @throws Error if no admin found
 * @throws Error if setting could not be revoked
 */

const revokeSetting = async (admin, setting) => {

    if (!admin) {
        throw new Error('No admin found.')
    }

    const success = await User.findByIdAndUpdate({ admin }, { $pull: { settings: setting } })

    if (!success) {
        throw new Error('Could not revoke setting.')
    }

    return success
}

export { getSettings, grantSetting, revokeSetting }
