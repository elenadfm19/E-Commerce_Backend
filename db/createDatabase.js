// Imports the Pool class from the pg (node-postgres) library.
// Pool manages a reusable pool of database connections
const { Pool } = require("pg");

// Loads environment variables from the '.env' file into 'process.env'.
require("dotenv").config();

async function createDatabase() {
  // Connect temporarily to the default "postgres" database.
  // This is required because the target database might not exist yet.
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres", // Use admin DB to run CREATE DATABASE
  });

  const dbName = process.env.DB_NAME;

  // Check if the target database already exists
  const res = await pool.query(
    `SELECT 1 FROM pg_database  WHERE datname = $1`,
    [dbName]
  );

  // If it doesn't exist → create it
  if (res.rowCount === 0) {
    await pool.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database "${dbName}" created`);
  } else {
    console.log(`Database "${dbName}" already exists`);
  }

  // Close the temporary admin connection
  await pool.end();
}
// Export the function so the app can call it during initialization
module.exports = createDatabase;
