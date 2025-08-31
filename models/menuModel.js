const db = require("../db/db.js");

class MenuModel {
  // ==================================================
  // Retrieve all the menu items from the 'items' table
  // ==================================================
  static async viewMenu() {
    try {
      const statement = `
    SELECT *
    FROM items;
    `;
      const results = await db.query(statement);
      return results.rows; // return the menu items as an array
    } catch (err) {
      console.error("MenuModel.viewMenu error:", err.message);
      throw err;
    }
  }
}

module.exports = MenuModel;