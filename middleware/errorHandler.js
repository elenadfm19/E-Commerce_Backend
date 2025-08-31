// Error-handling middleware for Express
function errorHandler(err, req, res, next) {
  // Log the actual error to the server console
  console.error("Error:", err);
  // Send back an HTTP response
  res.status(err.status || 500).send(err.message || "Internal Server Error");
}

module.exports = errorHandler;