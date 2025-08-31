const db = require("../db/db.js");

class UserModel {
  // ======================================
  // Find a user by their email address
  // (used mainly for login/authentication)
  // ======================================
  static async findByEmail(email) {
    const statement = `
    SELECT *
    FROM users
    WHERE email=$1
    `;
    try {
      const results = await db.query(statement, [email]);
      if (results.rows.length > 0) {
        return results.rows[0]; // return user object
      }
      return null; // if user not found
    } catch (err) {
      console.error("UserModel.findByEmail error:", err.message);
    }
  }

  // =======================
  // Find a user by their ID
  // =======================
  static async findById(id) {
    const statement = `
    SELECT *
    FROM users
    WHERE id=$1
    `;
    try {
      const results = await db.query(statement, [id]);
      if (results.rows.length > 0) {
        return results.rows[0]; // return user object
      }
      return null; // if user not found
    } catch (err) {
      console.error("UserModel.findByEmail error:", err.message);
    }
  }

  // ==================================================
  // Retrieve the user profile info for a given user ID
  // ==================================================
  static async viewProfile(userId) {
    try {
      const statement = `
    SELECT *
    FROM users
    WHERE id=$1;
    `;
      const results = await db.query(statement, [userId]);
      return results.rows[0];
    } catch (err) {
      console.error("UserModel.viewProfile error:", err.message);
    }
  }

  // ===================================
  // Register a new user in the database
  // - Inserts into the users table
  // - Returns the newly created user
  // ===================================
  static async registerUser(email, password, firstName, lastName, address) {
    try {
      const statement = `
    INSERT INTO users (email, password, firstName, lastName, address)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *;
    `;
      const results = await db.query(statement, [
        email,
        password,
        firstName,
        lastName,
        address,
      ]);
      return results.rows[0]; // return the new user object
    } catch (err) {
      console.error("UserModel.registerUser error:", err.message);
    }
  }

  // ==========================================
  // Delete a user from the database by user ID
  // ==========================================
  static async deleteUser(userId) {
    try {
      const statement = `
    DELETE FROM users
    WHERE id=$1;
    `;
      await db.query(statement, [userId]);
    } catch (err) {
      console.error("UserModel.registerUser error:", err.message);
    }
  }
}

module.exports = UserModel;
