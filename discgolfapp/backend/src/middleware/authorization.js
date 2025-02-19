/**
 * @author Lars263506 (Github)
 * @description This file contains middleware functions for authorizing users with different roles
 */

/**
 * @param req 
 * @param res 
 * @param next 
 * @description Authorizes a user as an admin
 */

const authorizeAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Authorization failed' });
    }
}

/**
 * @param req 
 * @param res 
 * @param next 
 * @description Authorizes a user as a clubowner
 */

const authorizeClubowner = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'clubowner') {
        next();
    } else {
        res.status(403).json({ error: 'Authorization failed' });
    }
}

export { authorizeAdmin, authorizeClubowner };
