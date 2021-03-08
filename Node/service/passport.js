const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const userDbService = require("./Database/user");
const config = require('../constants/database');

module.exports = {
    setStrategy: async function (passport) {
        var opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
        opts.secretOrKey = config.SECRET;

        passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
            try {
                const user = await userDbService.findOne({ id: jwt_payload.id });
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                return done(error, false);
            }
        }));
    },
    getToken: function (headers) {
        if (headers && headers.auth) {
            var parted = headers.auth.split(' ');
            if (parted.length === 2) {
                return parted[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}