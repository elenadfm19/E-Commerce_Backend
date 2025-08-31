// Imports the Pool class from the pg (node-postgres) library.
// Pool manages a reusable pool of database connections
const { Pool } = require('pg');

// Loads environment variables from the '.env' file into 'process.env'.
require('dotenv').config();

// Creates a new connection pool to the PostgreSQL database using the environment variables.
// This pool manages multiple client connections.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//Exports the pool for other parts of the app to reuse the same connection pool to the database.
module.exports = pool;