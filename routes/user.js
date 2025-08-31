const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport.js");
const bcrypt = require('bcrypt');
const UserModel = require("../models/userModel.js");
// Middleware that ensures user is logged in before accessing routes
const verifyAuthentication = require("../middleware/verifyAuthentication.js");

//Registers a new user in the database and logs the user in
/*
  @route POST /users/register
  @desc  Registers a new user and logs them in immediately
*/
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, firstName, lastName, address } = req.body;
    // Checks if user already exists with that username (email)
    const user = await UserModel.findByEmail(username);
    if (!user) {
      // If the user doesn´t exist we hash the password
      const salt = await bcrypt.genSalt(5);
      const hash = await bcrypt.hash(password, salt);
      // Saves the user into the database
      const userData = await UserModel.registerUser(
        username,
        hash,
        firstName,
        lastName,
        address
      );
      // Log the user in right after the registration
      req.login(userData, (err) => {
        if (err) return next(err);
        res.status(201).send("The user has been correctly created");
        //res.redirect("/menu");
      });
    } else {
      res.status(409).send("A user with this email address already exists");
    }
  } catch (err) {
    next(err);
  }
});

// Alternative login version using redirects. Useful when using views rather than a HTTP client
/*router.get(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/menu", //It redirects to the menu page if login succeeds
    failureRedirect: "/login", //It redirects to the login page if login fails
  })
);
*/


/*
  @route POST /users/login
  @desc  Logs in an existing user with Passport "local" strategy
*/
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send("Invalid credentials");
    // Log the user into the session
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(200).send("Logged in successfully");
    });
  })(req, res, next);
});

/*
  @route POST /users/logout
  @desc  Logs out the currently authenticated user
*/
router.post("/logout", verifyAuthentication, (req, res, next) => {
  // Logs the user out
  // Passport removes the req.user property and the user id is removed from the session;
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logged out successfully" });
    //res.redirect("/menu");
  });
});

/*
  @route GET /users/profile
  @desc  Retrieves the profile details of the authenticated user
*/
router.get("/profile", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const results = await UserModel.viewProfile(userId);
    res.status(200).send(results);
  } catch (err) {
    next(err);
  }
});

/*
  @route POST /users/delete
  @desc  Deletes the authenticated user from the database
*/
router.delete("/delete", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    await UserModel.deleteUser(userId);
    // Logs the user out
    // Passport removes the req.user property and the user id is removed from the session;
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).send("The user has been deleted");
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
