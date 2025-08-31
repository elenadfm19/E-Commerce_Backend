const db = require("../db/db.js");
const CartModel = require("./cartModel.js");

class OrderModel {
  // =======================================
  // Retrieve all orders for a specific user
  // =======================================
  static async findByUserId(userId) {
    try {
      const statement = `
        SELECT *
        FROM orders
        WHERE user_id=$1;
        `;
      const results = await db.query(statement, [userId]);
      return results.rows; // list of all orders
    } catch (err) {
      console.error("OrderModel.findByUserId error:", err.message);
      throw err;
    }
  }

  // ============================================================================================
  // Retrieve the items in a specific order with the specific item´s details from the items table
  // ============================================================================================
  static async findByOrderId(orderId) {
    try {
      const statement = `
        SELECT *
        FROM orders_items
        LEFT JOIN items
        ON orders_items.item_id=items.id
        WHERE order_id=$1;
        `;
      const results = await db.query(statement, [orderId]);
      return results.rows; // list of items in the order
    } catch (err) {
      console.error("OrderModel.findByOrderId error:", err.message);
      throw err;
    }
  }

  // =====================================
  // Create a new order from a user's cart
  // =====================================
  static async create(userId) {
    try {
      // Find the cart data associated with that user id
      const cartData = await CartModel.findByUserId(userId);
      // Make sure the cart isn´t empty
      if (cartData.total_items > 0) {
        // Add a new row to the orders 'table'
        const statement1 = `
            INSERT INTO orders (user_id, total_items, total_cost)
            VALUES($1, $2, $3)
            RETURNING id;
            `;
        const results = await db.query(statement1, [
          userId,
          cartData.total_items,
          cartData.total_cost,
        ]);

        // Get the id of the order that has just been placed
        const orderId = results.rows[0].id;

        // Copy the items from the cart into the 'orders_items' table
        const statement2 = `
        INSERT INTO orders_items (order_id, item_id, quantity)
        SELECT $1, item_id, quantity
        FROM carts_items
        WHERE cart_id=$2;
        `;
        await db.query(statement2, [orderId, cartData.id]);

        // Delete the cart once the order is placed
        CartModel.delete(userId);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("OrderModel.create error:", err.message);
      throw err;
    }
  }
}

module.exports = OrderModel;
