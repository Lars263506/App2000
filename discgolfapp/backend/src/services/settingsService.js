import User from '../models/User.js'

/**
 * @author Lars Andreas Strand
 * @description Service for settings

/**
 * @author Lars Andreas Strand
 * @description Gets all settings available to logged in admin user.
 * @param admin
 * @returns Array of settings for the user
 * @throws Error if no settings
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
 * @param admin
 * @param setting
 * @returns Whether the setting was granted or not
 * @throws Error if no admin found
 * @throws Error if setting could not be granted
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
 * @param admin
 * @param setting
 * @returns Whether the setting was revoked or not
 * @throws Error if no admin found
 * @throws Error if setting could not be revoked
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
