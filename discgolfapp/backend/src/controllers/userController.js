import * as userService from '../services/userService.js'


/**
 * @author Lars Andreas Strand
 * @description This controller contains request handlers for user registration, authentication and user data management
 */

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get all users.
 * It retrieves all users from the database and sends them as a response.
 * If successful, it sends a 200 status code and the users data.
 * If there is an error, it sends a 404 status code and the error message.
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
 * @author Lars Andreas Strand
 * @description This function handles the request to get permissions for a user.
 * It retrieves the permissions from the database and sends them as a response.
 * If successful, it sends a 200 status code and the permissions data.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getPermissions = async (req, res) => {
  try {
    res.status(200).json(await userService.getPermissions(req.user.id))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get the profile of a user.
 * It retrieves the profile from the database and sends it as a response.
 * If successful, it sends a 200 status code and the profile data except hashed password.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getProfile = async (req, res) => {
  try {
    res.status(200).json(await userService.getProfile(req.user.id))
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get the profile image of a user.
 * It retrieves the image from the database and sends it as a response.
 * If successful, it sends a 200 status code and the image data.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getProfileImage = async (req, res) => {
  try {
    await userService.getProfileImage(req.params.filename, res)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get a specific user by ID.
 * It retrieves the user from the database and sends it as a response.
 * If successful, it sends a 200 status code and the user data (except hashed password).
 * If there is an error, it sends a 404 status code and the error message.
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
 * @author Lars Andreas Strand
 * @description This function handles the request to get a specific user by email.
 * It retrieves the user from the database and sends it as a response.
 * If successful, it sends a 200 status code and the user data (except hashed password).
 * If there is an error, it sends a 404 status code and the error message.
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

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get all clubs the user is a member of.
 * It retrieves all clubs for the user from the database and sends them as a response.
 * If successful, it sends a 200 status code and the clubs data.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getUserClubs = async (req, res) => {
  try {
    const userId = req.user.id
    const clubs = await userService.getUserClubs(userId)
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get all games the user has played.
 * It retrieves all games for the user from the database and sends them as a response.
 * If successful, it sends a 200 status code and the games data.
 * If there is an error, it sends a 404 status code and the error message.
 */

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
 * @author Lars Andreas Strand
 * @description This function handles the request to check if a user is an admin.
 * It checks the user's role and sends a response indicating if the user is an admin or not.
 * If successful, it sends a 200 status code and the isAdmin status.
 * If there is an error, it sends a 500 status code and the error message.
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
 * @author Lars Andreas Strand
 * @description This function handles the request to register a new user.
 * It retrieves the user data from the request body and calls the service to register the user.
 * If successful, it sends a 201 status code and the created user data.
 * If there is an error, it sends a 400 status code and the error message.
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
 * @author Lars Andreas Strand
 * @description This function handles the request to log in a user.
 * It retrieves the email and password from the request body and calls the service to log in the user.
 * If successful, it sends a 200 status code and the access token, refresh token and display name.
 * If there is an error, it sends a 401 status code and the error message.
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
 * @author Lars Andreas Strand
 * @description This function handles the request to upload a profile image for a user.
 * It retrieves the user ID from the request and the image data from the request file.
 * If successful, it sends a 200 status code and the result of the image upload.
 * If there is an error, it sends a 500 status code and the error message.
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
 * @author Lars Andreas Strand
 * @description This function handles the request to change the display name of a user.
 * It retrieves the email and new display name from the request body and calls the service to change the display name.
 * If successful, it sends a 200 status code and the updated display name.
 * If there is an error, it sends a 404 status code and the error message.
 * If the email or new display name is missing, it sends a 400 status code and an error message.
 */

const changeDisplayName = async (req, res) => {
  const { email, newDisplayName } = req.body

  if (!email || !newDisplayName) {
    return res.status(400).json({ message: 'Email and new display name are required' })
  }

  try {
    const { emailChangedAt } = await userService.changeDisplayName(email, newDisplayName)
    res.status(200).json(emailChangedAt)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to change the email of a user.
 * It retrieves the email and new email from the request body and calls the service to change the email.
 * If successful, it sends a 200 status code and the updated email.
 * If there is an error, it sends a 404 status code and the error message.
 * If the email or new email is missing, it sends a 400 status code and an error message.
 */

const changeEmail = async (req, res) => {
  const { email, newEmail } = req.body

  if (!email || !newEmail) {
    return res.status(400).json({ message: 'Email and new email are required' })
  }

  try {
    const { emailChangedAt } = await userService.changeEmail(email, newEmail)
    res.status(200).json(emailChangedAt)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to change the password of a user.
 * It retrieves the email and new password from the request body and calls the service to change the password.
 * If successful, it sends a 200 status code and the updated password.
 * If there is an error, it sends a 404 status code and the error message.
 * If the email or new password is missing, it sends a 400 status code and an error message.
 */

const changePassword = async (req, res) => {
  const { email, newPassword } = req.body

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' })
  }

  try {
    const { passwordChangedAt } = await userService.changePassword(email, newPassword)
    res.status(200).json(passwordChangedAt)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to change the role of a user.
 * It retrieves the email and new role from the request body and calls the service to change the role.
 * If successful, it sends a 200 status code and the updated role.
 * If there is an error, it sends a 404 status code and the error message.
 * If the email or new role is missing, it sends a 400 status code and an error message.
 */

const changeRole = async (req, res) => {
  const { email, newRole } = req.body

  if (!email || !newRole) {
    return res.status(400).json({ message: 'Email and new role are required' })
  }

  try {
    const { userRole, roleChangedAt } = await userService.changeRole(email, newRole)
    res.status(200).json({ userRole, roleChangedAt })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to delete a user.
 * It retrieves the email from the request body and calls the service to delete the user.
 * If successful, it sends a 200 status code and the deleted user data.
 * If there is an error, it sends a 404 status code and the error message.
 * If the email is missing, it sends a 400 status code and an error message.
 */

const deleteUser = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  try {
    const user = await userService.deleteUser(email)
    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
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
