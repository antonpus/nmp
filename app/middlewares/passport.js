import passport from 'passport';
import LocalStrategy from 'passport-local';
import authHelper from '../helpers/authHelper'

passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
}, (login, password, done) => {
    authHelper.authenticateAsync(login, password)
        .then(user => done(null, user),
            err => done(null, false, err))
        .catch(err => done(err));
}));

const auth = (req, res, next) => passport.authenticate('local', {session: false},
    (err, user, info) => {
        if (!user) {
            return res.send(authHelper.toFailureAuthResponse(401, info));
        }
        return res.send(authHelper.toSuccessfulAuthResponse(user));
    })(req, res, next);

export default {auth};