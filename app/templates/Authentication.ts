import passport = require('passport');
<% if (local) { -%>
import {Strategy as LocalStrategy} from 'passport-local';
<% } -%>
<% if (bearer) { -%>
import {Strategy as BearerStrategy} from 'passport-http-bearer';
<% } -%>
<% if (basic) { -%>
let BasicStrategy = require('passport-http').BasicStrategy;
<% } -%>
<% if (local) { -%>

passport.use(new LocalStrategy((user, pass, done) => {
    if (user === 'demo' && pass === 'auth') {
        done(null, { user });
        return;
    }
    done(null, false);
}));
<% } -%>
<% if (bearer) { -%>

passport.use(new BearerStrategy((token, done) => {
    if (token === 'super-secret-bearer-token') {
        done(null, { user: 'bearer' });
        return;
    }
    done(null, false);
}));
<% } -%>
<% if (basic) { -%>

passport.use(new BasicStrategy((user, pass, done) => {
    if (user === 'demo' && pass === 'auth') {
        done(null, { user });
        return;
    }
    done(null, false);
}));
<% } -%>

export default passport;
