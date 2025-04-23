import User from '../models/User.js'

/**
 * @author Lars Andreas Strand
 * @description Service for settings

/**
 * @author Lars Andreas Strand
 * @description Gets all settings available to logged in admin user.
 * @param {String} admin - The ID of the admin user
 * @returns {Array} - An array of settings available to the admin user
 * @throws {Error} - If no admin found or if no settings found on the user
 * @throws {Error} - If no settings found on this user. Ask superadmin for access.
 */

const getSettings = async (admin) => {
    if (!admin) {
        throw new Error('No admin found.')
    }

    const user = await User.findById(admin).select('settings')

    if (!user || !user.settings) {
        throw new Error('No settings found on this user. Ask superadmin for access.')
    }

    const settings = user.settings.map(setting => ({
        name: setting.name,
        description: setting.description
    }))

    return settings
}

/**
 * @author Lars Andreas Strand
 * @description Grants a setting to the admin user
 * @param {String} displayName - The ID of the admin user
 * @param {String} setting - The setting to grant
 * @returns {Object} - The updated user object
 * @throws {Error} - If not successful in granting the setting
 */

const grantSetting = async (displayName, setting) => {

    const success = await User.findOneAndUpdate(
        { displayName },
        { $addToSet: { settings: setting } },
        { new: true }
    )

    if (!success) {
        throw new Error('Could not grant setting.')
    }

    return success
}

/**
 * @author Lars Andreas Strand
 * @description Revokes a setting from the admin user
 * @param {String} displayName - The ID of the admin user
 * @param {String} setting - The setting to revoke
 * @returns {Object} - The removed user object
 * @throws {Error} - If not successful in revoking the setting
 */

const revokeSetting = async (displayName, setting) => {

    const success = await User.findOneAndUpdate(
        { displayName },
        { $pull: { settings: setting } },
        { new: true }
    )

    if (!success) {
        throw new Error('Could not revoke setting.')
    }

    return success
}

export { getSettings, grantSetting, revokeSetting }
