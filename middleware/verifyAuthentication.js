// Middleware to verify if the user is currently authenticated
function verifyAuthentication(req, res, next) {
  // Passport adds req.isAuthenticated() to check if the user is logged in
  if (req.isAuthenticated()) return next();
  // If not authenticated, respond with 401 Unauthorized
  res.status(401).json({ message: "Unauthorized" });
}

module.exports = verifyAuthentication;
