const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel.js");

/* 
  Local Strategy configuration
  - By default, LocalStrategy expects fields called "username" and "password".
  - Here "username" corresponds to the user's email.
*/
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Look up the user in the database by email (username here = email)
      const user = await UserModel.findByEmail(username);
      // If no user is found, the authentication fails
      if (!user) return done(null, false);
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      // If passwords don't match, the authentication fails
      if (!passwordMatch) return done(null, false);
      // If everything is correct, return the user object
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// After successful authentication, only the user id is saved in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// For each request, Passport fetches the full user by id and attaches it to req.user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
