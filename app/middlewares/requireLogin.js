//
// Require Login
//

'use strict';

var passport = require('passport');

module.exports = function(req, res, next) {
    if (req.user) {
        next();
        return;
    }

    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        if (parts.length === 2) {
            var scheme = parts[0],
                credentials = parts[1],
                auth;

            if (/^Bearer$/i.test(scheme)) {
                auth = passport.authenticate('bearer', { session: false });
                return auth(req, res, next);
            }

            if (/^Basic$/i.test(scheme)) {
                auth = passport.authenticate('basic', { session: false });
                return auth(req, res, next);
            }
        }
    }

    res.redirect('/login');
};
