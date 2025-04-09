/**
 * @author Lars Andreas Strand
 * @description Middleware for authorizing users with different roles
 * Protects routes based on user roles, implementing role-based access control.
 * It uses the Passport JWT strategy to authenticate users and check their roles.
 */

/**
 * @author Lars Andreas Strand
 * @description This middleware function checks if the user is authenticated and is an admin.
 * It uses the Passport JWT strategy to authenticate the user and checks their role.
 * If the user is authenticated and is an admin, it allows access to the next middleware or route handler.
 * If the user is not authenticated or not an admin, it sends a 403 Forbidden response.
 * It is used to protect routes that require admin access.
 */

const authorizeAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ error: 'Authorization failed' })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This middleware function checks if the user is authenticated and is a club owner.
 * It uses the Passport JWT strategy to authenticate the user and checks their role.
 * If the user is authenticated and is a club owner, it allows access to the next middleware or route handler.
 * If the user is not authenticated or not a club owner, it sends a 403 Forbidden response.
 * It is used to protect routes that require club owner access or higher privileges.
 */

const authorizeClubowner = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'clubowner') {
    next()
  } else {
    res.status(403).json({ error: 'Authorization failed' })
  }
}

export { authorizeAdmin, authorizeClubowner }
