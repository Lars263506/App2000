import * as userService from '../services/userService.js'


/**
 * @author Lars263506 (Github)
 * @description This controller contains request handlers for user registration, authentication and user data management
 */

/**
 * @returns User array, excluding hashed password
 * @description Gets all users from the database for testing and debugging purposes
 * @throws Error if no users were found
 */

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Checks the permissions of a user
 * @throws Error if the user was not found
 */

const getPermissions = async (req, res) => {
  try {
    res.status(200).json(await userService.getPermissions(req.user.id))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Gets the profile of a user
 * @throws Error if the user was not found
 */

const getProfile = async (req, res) => {
  try {
    res.status(200).json(await userService.getProfile(req.user.id))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Gets the profile of a user
 * @throws Error if the user was not found
 */

const getProfileImage = async (req, res) => {
  try {
    await userService.getProfileImage(req.params.filename, res)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Gets a user from the database by id
 * @throws Error if the user was not found
 */

const getUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userService.getUser(id)
    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Gets a user from the database by email
 * @throws Error if the user was not found
 */

const getUserByEmail = async (req, res) => {
  try {
    const email = req.body.email
    const user = await userService.getUserByEmail(email)
    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

const getUserClubs = async (req, res) => {
  try {
    const userId = req.user.id
    const clubs = await userService.getUserClubs(userId)
    res.status(200).json(clubs);  
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
}

const getUserGames = async (req, res) => {
  try {
    const userId = req.user.id;
    const games = await userService.getUserGames(userId);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch games', error });
  }
}

/**
 * @returns boolean that is true if the user is an admin, false if not
 * @description Checks if a user is an admin
 */

const checkIfAdmin = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin'
    res.status(200).json({ isAdmin })
  } catch (error) {
    res.status(500).json({ error: "Couldn't check if user is an admin, try again later." }); 
  }
}

/**
 * @param req
 * @param res
 * @description Registers a new user in the database
 * @throws Error if there was an error registering the user in the database
 */

const registerUser = async (req, res) => {
  const { displayName, email, password } = req.body
  try {
    const { createdAt } = await userService.registerUser(displayName, email, password)
    res.status(201).json(createdAt)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Logs in a user and tokens are created for the user
 * @throws Error if the email or password is incorrect
 */

const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const { accessToken, refreshToken, displayName } = await userService.loginUser(email, password)
    res.status(200).json({ accessToken, refreshToken, displayName })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Logs in a user and tokens are created for the user
 * @throws Error if the email or password is incorrect
 */

const postProfileImage = async (req, res) => {
  console.log("Controller: postProfileImage called");
  try {
    const result = await userService.postProfileImage(req.user.id, req.file.buffer, req.file.mimetype);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong with the image upload" });
  }
};

/**
 * @param req
 * @param res
 * @description Changes the display name of a user in the database
 * @throws Error if there was an error changing the display name in the database
 */

const changeDisplayName = async (req, res) => {
  const { email, newDisplayName } = req.body
  try {
    const { emailChangedAt } = await userService.changeDisplayName(email, newDisplayName)
    res.status(200).json(emailChangedAt)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Changes the email of a user in the database
 * @throws Error if there was an error changing the email in the database
 */

const changeEmail = async (req, res) => {
  const { email, newEmail } = req.body
  try {
    const { emailChangedAt } = await userService.changeEmail(email, newEmail)
    res.status(200).json(emailChangedAt)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Changes the password of a user in the database
 * @throws Error if there was an error changing the password in the database
 */

const changePassword = async (req, res) => {
  const { email, newPassword } = req.body
  try {
    const { passwordChangedAt } = await userService.changePassword(email, newPassword)
    res.status(200).json(passwordChangedAt)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Changes the role of a user in the database
 * @throws Error if there was an error changing the role in the database
 */

const changeRole = async (req, res) => {
  const { email, newRole } = req.body
  try {
    const { userRole, roleChangedAt } = await userService.changeRole(email, newRole)
    res.status(200).json({ userRole, roleChangedAt })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * @param req
 * @param res
 * @description Deletes a user from the database
 * @throws Error if there was an error deleting the user from the database
 */

const deleteUser = async (req, res) => {
  const { email } = req.body
  try {
    const user = await userService.deleteUser(email)
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export {
  getAllUsers,
  getPermissions,
  getProfile,
  getProfileImage,
  getUser,
  getUserByEmail,
  getUserClubs,
  getUserGames,
  checkIfAdmin,
  registerUser,
  loginUser,
  postProfileImage,
  changeDisplayName,
  changeEmail,
  changePassword,
  changeRole,
  deleteUser
}
