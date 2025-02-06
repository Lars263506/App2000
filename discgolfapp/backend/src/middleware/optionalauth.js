import passport from '../config/passportConfig.js';

const optionalAuth = (req, res, next) => {
    if (req.header("Authorization")) {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (user) req.user = user;
            return next();
        })(req, res, next);
    } else {
        req.user = { role: "user" };
        next();
    }
}

export { optionalAuth };
