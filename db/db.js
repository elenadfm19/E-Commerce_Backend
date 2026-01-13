// Import the `Pool` class from the `pg` library.
// A Pool manages multiple PostgreSQL client connections efficiently.
const { Pool } = require("pg");
// Load environment variables from .env into process.env
require("dotenv").config();

// Create a new connection pool that will be used throughout the app.
// Since the DB is already created at this stage, we point directly to it.
const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // <-- now DB exists
});

module.exports = db;
