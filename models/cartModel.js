const db = require("../db/db.js");

class CartModel {
  // ==============================================
  // HELPER FUNCTION: Retrieve cart id from user id
  // ==============================================
  static async getCartId(userId) {
    try {
      const statement = `
        SELECT *
        FROM carts
        WHERE user_id=$1
        `;
      const cart = await db.query(statement, [userId]);
      if (cart.rows.length > 0) return cart.rows[0].id;
      return null;
    } catch (err) {
      console.error("CartModel.getItemPriceCartId error:", err.message);
      throw err;
    }
  }

  // ====================================================
  // HELPER FUNCTION: Retrieve price of an item by its id
  // ====================================================
  static async getItemPrice(itemId) {
    try {
      const statement = `
        SELECT *
        FROM items
        WHERE id=$1
        `;
      const item = await db.query(statement, [itemId]);
      if (item.rows.length > 0) return item.rows[0].price;
      return null;
    } catch (err) {
      console.error("CartModel.getItemPriceCartId error:", err.message);
      throw err;
    }
  }

  // =================================
  // Create a cart for a given user id
  // =================================
  static async create(userId) {
    try {
      const statement = `
        INSERT INTO carts (user_id)
        VALUES($1);
        `;
      await db.query(statement, [userId]);
    } catch (err) {
      console.error("CartModel.create error:", err.message);
      throw err;
    }
  }

  // ====================================================
  // Delete a cart for a given user id
  // (It also deletes related items in carts_items table)
  // ====================================================
  static async delete(userId) {
    try {
      const cartId = await this.getCartId(userId);
      // Delete the items from the table carts_items table in the database
      const statement1 = `
        DELETE FROM carts_items
        WHERE cart_id=$1;
        `;
      await db.query(statement1, [cartId]);
      // Deletes the cart from carts table in the database
      const statement2 = `
        DELETE FROM carts
        WHERE id=$1;
        `;
      await db.query(statement2, [cartId]);
    } catch (err) {
      console.error("CartModel.create error:", err.message);
      throw err;
    }
  }

  // =========================================
  // Retrieve a cart details using the user id
  // =========================================
  static async findByUserId(userId) {
    try {
      const statement = `
        SELECT *
        FROM carts
        WHERE user_id=$1;
        `;

      const results = await db.query(statement, [userId]);
      return results.rows[0];
    } catch (err) {
      console.error("CartModel.findByUserId error:", err.message);
      throw err;
    }
  }

  // =============================================================================================
  // Retrieve the cart items (using cart id) with the specific item´s details from the items table
  // =============================================================================================
  static async findByCartId(cartId) {
    try {
      const statement = `
        SELECT *
        FROM carts_items
        LEFT JOIN items
        ON carts_items.item_id=items.id
        WHERE cart_id=$1;
        `;
      const results = await db.query(statement, [cartId]);
      return results.rows;
    } catch (err) {
      console.error("CartModel.findByCartId error:", err.message);
      throw err;
    }
  }

  // ===============================================
  // Add an item to a user's cart
  // (increases quantity if the item already exists)
  // ===============================================
  static async addItemToCart(itemId, userId) {
    try {
      const cartId = await this.getCartId(userId);
      const itemPrice = await this.getItemPrice(itemId);
      // Check that there is a cart created for the current user and the item ID exists
      if (cartId && itemPrice) {
        // Insert item into carts_items, or increment the quantity if it already exists
        const statement1 = `
        INSERT INTO carts_items (cart_id, item_id, quantity)
        VALUES ($1, $2, 1)
        ON CONFLICT (cart_id, item_id) DO UPDATE
        SET quantity = carts_items.quantity + 1
       WHERE carts_items.cart_id=$1 AND carts_items.item_id=$2;
       `;
        await db.query(statement1, [cartId, itemId]);

        // Update cart totals: cost + number of items
        const statement2 = `
        UPDATE carts
        SET total_cost=total_cost+$1, total_items=total_items+1
        WHERE user_id=$2;
        `;
        await db.query(statement2, [itemPrice, userId]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("CartModel.findByUserId error:", err.message);
      throw err;
    }
  }

  // ============================================
  // Remove an item from a user's cart
  // (decrease quantity or delete if last one)
  // ============================================
  static async deleteItemFromCart(itemId, userId) {
    try {
      const cartId = await this.getCartId(userId);
      const itemPrice = await this.getItemPrice(itemId);

      // Check that there is a cart created for the current user and the item ID exists
      if (cartId && itemPrice) {
        // Check current quantity of this item in the cart
        const statement1 = `
        SELECT quantity
        FROM carts_items
        WHERE cart_id=$1 AND item_id=$2
        `;
        const results = await db.query(statement1, [cartId, itemId]);

        let statement2 = ``;
        if (results.rows.length === 0) {
          return false; // Item not in cart, nothing to do
        } else if (results.rows[0].quantity === 1) {
          // If only one, delete the item from the cart
          statement2 = `
        DELETE FROM carts_items
        WHERE cart_id=$1 AND item_id=$2;
        `;
        } else {
          // If more than one, decrement the quantity in the cart
          statement2 = `
        UPDATE carts_items
        SET quantity=quantity-1
        WHERE cart_id=$1 AND item_id=$2;
        `;
        }
        await db.query(statement2, [cartId, itemId]);

        // Update the carts totals: cost + number of items
        const statement3 = `
        UPDATE carts
        SET total_cost=total_cost-$1, total_items=total_items-1
        WHERE user_id=$2;
        `;
        await db.query(statement3, [itemPrice, userId]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("CartModel.findByUserId error:", err.message);
      throw err;
    }
  }
}

module.exports = CartModel;
