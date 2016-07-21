import passport = require('passport');
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
let BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new LocalStrategy((user, pass, done) => {
    if (user === 'demo' && pass === 'auth') {
        done(null, { user });
    }
    done(null, false);
}));

passport.use(new BearerStrategy((token, done) => {
    if (token === 'super-secret-bearer-token') {
        done(null, { user: 'bearer' });
    }
    done(null, false);
}));

passport.use(new BasicStrategy((user, pass, done) => {
    if (user === 'demo' && pass === 'auth') {
        return done(null, { user });
    }
    return done(null, false);
}));

export default passport;
