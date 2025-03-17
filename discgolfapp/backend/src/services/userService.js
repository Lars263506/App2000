import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { GridFSBucket } from 'mongodb';
import { v4 as uuid4 } from 'uuid';

import User from '../models/User.js'
import ClubPage from '../models/Clubpage.js'

/**
 * @author Lars263506 (Github)
 * @description This service contains functions for user registration, authentication and user data management, and handles mongoDB communication
 */

/**
 * @returns User array, excluding hashed password
 * @description Gets all users from the database for testing and debugging purposes
 * @throws Error if no users were found
 */

const getAllUsers = async () => {
  const users = await User.find({}).select('-hashedPassword')
  if (!users) throw new Error('Users not found')
  return users
}

/**
 * @param id
 * @returns Whether the user has permission to edit the club page
 * @description Checks the permissions of a user to edit a club page
 */

const getPermissions = async (id) => {
  const hasPermission = await ClubPage.findOne({ clubOwner: id })
  if (hasPermission) return { canEditClubPage: true }
  else return { canEditClubPage: false }
}

/**
 * @param id
 * @returns User profile object
 * @description Gets the profile of a user
 */

const getProfile = async (id) => {
  const userProfile = await User.findById(id).select('-hashedPassword, -emailChangedAt, -passwordChangedAt, -roleChangedAt')
  if (!userProfile) throw new Error('User not found')
  return userProfile
}

/**
 * @param id
 * @returns User profile object
 * @description Gets the profile of a user
 */

const getProfileImage = async (filename, res) => {
  console.log(filename)
    try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

    const downloadStream = bucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
        res.status(404).json({ error: 'Image not found' });
    });

    } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * @param id
 * @returns User object, excluding hashed password
 * @description Gets a user from the database by id
 * @throws Error if the user was not found
 */

const getUser = async (id) => {
  const user = await User.findById(id).select('-hashedPassword')
  if (!user) throw new Error('User not found')
  return user
}

/**
 * @param email
 * @returns User object, excluding hashed password
 * @description Gets a user from the database by email
 * @throws Error if the user was not found
 */

const getUserByEmail = async (email) => {
  const user = await User.find({ email }).select('-hashedPassword')
  if (!user) throw new Error('User not found')
  return user
}

/**
 * @param id
 * @returns List of clubs the user is a member of
 * @description Gets all clubs a user is a member of
 * @throws Error if no clubs are found
 */
const getUserClubs = async (id) => {
  try {
    const clubs = await ClubPage.find({ members: id });
    if (!clubs) throw new Error('No clubs found for the user');
    return clubs;
  } catch (error) {
    console.error("Error fetching user's clubs:", error);
    throw new Error('Error fetching clubs');
  }
}

/**
 *
 * @param email
 * @param password
 * @returns Time of user creation
 * @description Registers a new user in the database
 * @throws Error if there was an error registering the user in the database
 */

const registerUser = async (displayName, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  const changedTime = new Date()
  const newUser = {
    displayName,
    email,
    hashedPassword,
    role: 'user',
    emailChangedAt: changedTime,
    passwordChangedAt: changedTime,
    roleChangedAt: changedTime
  }
  let user
  try {
    user = await User.create(newUser)
  } catch (error) {
    throw new Error('Email is already in use')
  }
  return { createdAt: user.createdAt }
}

/**
 * @param email
 * @param password
 * @returns accessToken and refreshToken
 * @description Logs in a user and tokens are created for the user
 * @throws Error if the email or password is incorrect
 */

const loginUser = async (email, password) => {
  const user = await User.findOne({ email })

  let passwordIsValidated = false
  if (user) {
    passwordIsValidated = await bcrypt.compare(password, user.hashedPassword)
  };

  if (!passwordIsValidated) throw new Error('Incorrect email or password')

  const payload = { id: user._id, role: user.role }

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' })
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken, displayName: user.displayName }
}

/**
 * @param email
 * @param password
 * @returns accessToken and refreshToken
 * @description Logs in a user and tokens are created for the user
 * @throws Error if the email or password is incorrect
 */

const postProfileImage = async (id, buffer, mimetype) => {
  console.log("Service: postProfileImage called");
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

    const filename = `${id}-${uuid4()}`;

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: mimetype
    });

    uploadStream.end(buffer);

    return new Promise((resolve, reject) => {
      uploadStream.on('finish', async () => {
        user.profileImage = filename;
        await user.save();
        resolve({ message: 'Profile image updated!', profileImage: filename });
      });

      uploadStream.on('error', (err) => {
        console.error('GridFS upload error:', err);
        reject(new Error('Internal server error'));
      });
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    throw new Error('Internal server error');
  }
};

/**
 * @param email
 * @param displayName
 * @returns Time of display name change
 * @description Changes the display name of a user in the database
 */

const changeDisplayName = async (email, newDisplayName) => {
  const user = await User.findOneAndUpdate({ email }, { displayName: newDisplayName }, { new: true })
  if (!user) throw new Error('User not found')

  return { emailChangedAt: user.emailChangedAt }
}

/**
 * @param email
 * @param newEmail
 * @returns Time of email change
 * @description Changes the email of a user in the database
 */

const changeEmail = async (email, newEmail) => {
  const user = await User.findOneAndUpdate({ email }, { email: newEmail }, { new: true })
  if (!user) throw new Error('User not found')

  return { emailChangedAt: user.emailChangedAt }
}

/**
 *
 * @param email
 * @param newPassword
 * @returns Time of password change
 * @description Changes the password of a user in the database
 */

const changePassword = async (email, newPassword) => {
  newPassword = await bcrypt.hash(newPassword, 10)

  const user = await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true })
  if (!user) throw new Error('User not found')

  return { passwordChangedAt: user.passwordChangedAt }
}

/**
 *
 * @param email
 * @param newRole
 * @returns New user role and time of role change
 * @description Changes the role of a user in the database
 */

const changeRole = async (email, newRole) => {
  const user = User.findOneAndUpdate({ email }, { role: newRole })

  if (!user) throw new Error('User not found')

  return { role: user.role, roleChangedAt: user.roleChangedAt }
}

/**
 * @param email
 * @returns Whether the user was deleted or not
 * @description Deletes a user from the database
 */

const deleteUser = async (email) => {
  const deletedUser = await User.findOneAndDelete({ email })
  if (!deletedUser) throw new Error('User not found')
  return { success: true }
}

export {
  getAllUsers,
  getPermissions,
  getProfile,
  getProfileImage,
  getUser,
  getUserByEmail,
  getUserClubs,
  registerUser,
  loginUser,
  postProfileImage,
  changeDisplayName,
  changeEmail,
  changePassword,
  changeRole,
  deleteUser
}
