import passport = require('passport');
import { Strategy as BearerStrategy } from 'passport-http-bearer';

passport.use(new BearerStrategy((token, done) => {
    if (token === 'super-secret-bearer-token') {
        done(null, { user: 'bearer' });
        return;
    }
    done(null, false);
}));

export default passport;
