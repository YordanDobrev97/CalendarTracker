const passport = require('../utils/passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '633753943075-n8g4csf68ij9varq4s6e66urrbenvls8.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      //userProfile=profile;
      return done(null, profile);
  }
));

module.exports = passport
 