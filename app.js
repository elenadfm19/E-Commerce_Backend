const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("./middleware/passport.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const userRoutes = require("./routes/user.js");
const menuRoutes = require("./routes/menu.js");
const errorHandler = require("./middleware/errorHandler.js");
const PORT = process.env.PORT;

// Parses incoming requests with JSON payloads
app.use(bodyParser.json());

// Enables Cross Origin Resource Sharing to all origins by default
app.use(cors());

// Creates a session by using the express-session middleware for persistent login sessions
// Required for Passport's login session management
app.use(
  session({
    resave: false, // don´t save session if unmodified
    saveUninitialized: false, // don´t create empty sessions
    secret: process.env.SESSION_SECRET, // secret key to sign the session ID cookie
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // not using HTTPS, 1 day expiration
  })
);

// Initialize passport authentication middleware
app.use(passport.initialize());
app.use(passport.session()); // connects passport to persistent login sessions

// Mount route handlers to different API domains
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/menu", menuRoutes);
app.use("/users", userRoutes);

// Handler for catching unknown routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Error handler middleware
app.use(errorHandler);

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
