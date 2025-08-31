const db = require("./db/db.js");

/*
  Initializes the PostgreSQL database by creating tables
  and seeding initial menu data if they do not already exist.
 */
async function setupDatabase() {
  // Orders table: stores user orders, references `users`
  const ordersTable = `
        CREATE TABLE IF NOT EXISTS orders(
            id SERIAL PRIMARY KEY,
            user_id integer REFERENCES users(id),
            total_items integer,
            total_cost decimal(10,2),
            created TIMESTAMP DEFAULT NOW()
        );
    `;
  // Items table: stores available menu items (pizza, drinks, etc.)
  const itemsTable = `
        CREATE TABLE IF NOT EXISTS items(
            id integer PRIMARY KEY,
            price decimal(10,2),
            name varchar(50),
            type varchar(50)
        );
    `;
  // Join table for orders and items (many-to-many relationship)
  const ordersItemsTable = `
        CREATE TABLE IF NOT EXISTS orders_items(
            order_id integer REFERENCES orders(id),
            item_id integer REFERENCES items(id),
            quantity integer
        );
    `;
  // Users table: basic user account info (auth + profile data)
  const usersTable = `
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            email varchar(50) UNIQUE,
            password text,
            firstName varchar(50),
            lastName varchar(50),
            address varchar(50)
        );
    `;
  // Carts table: one shopping cart per user (enforced by UNIQUE constrainton user id)
  const cartsTable = `
        CREATE TABLE IF NOT EXISTS carts(
            id SERIAL PRIMARY KEY,
            user_id integer REFERENCES users(id) UNIQUE,
            total_items integer DEFAULT 0,
            total_cost decimal(10,2) DEFAULT 0,
            created TIMESTAMP DEFAULT NOW()
        );
    `;
  // Join table for carts and items (many-to-many relationship)
  const cartsItemsTable = `
        CREATE TABLE IF NOT EXISTS carts_items(
            cart_id integer REFERENCES carts(id),
            item_id integer REFERENCES items(id),
            quantity integer,
            UNIQUE (cart_id, item_id)
        );
    `;
  // Seed the `items` table with menu data (only inserts if not already present)
  const updateMenu = `
    INSERT INTO items (id, price, name, type) VALUES
    (1, 3.5, 'Pane & Olio', 'starters'),
    (2, 4.5, 'Marinated Olives', 'starters'),
    (3, 5.95, 'Garlic Focaccia', 'starters'),
    (4, 6.5, 'Tomato Bruschetta', 'starters'),
    (5, 7.5, 'Aubergine Parmigiana', 'starters'),
    (6, 5.99, 'Caprese di Burrata', 'starters'),
    (7, 7.95, 'Meatballs', 'starters'),
    (8, 10.95, 'Margherita', 'pizza'),
    (9, 12.75, 'Prosciutto & Funghi', 'pizza'),
    (10, 13.95, 'Truffle & Burrata', 'pizza'),
    (11, 13.25, 'Cinque Fromaggi', 'pizza'),
    (12, 13.50, 'Spicy Salami', 'pizza'),
    (13, 14.25, 'Tonno', 'pizza'),
    (14, 14.25, 'Amatriciana', 'pizza'),
    (15, 12.95, 'Chorizo', 'pizza'),
    (16, 12.75, 'Napoli', 'pizza'),
    (17, 16.5, 'Spaghetti alla Carbonara', 'pasta'),
    (18, 13.95, 'Penne all''Arrabbiatta', 'pasta'),
    (19, 15.75, 'Pasta alla Norma', 'pasta'),
    (20, 13.75, 'Ravioli di Ricotta e Spinaci', 'pasta'),
    (21, 16.25, 'Fettuccine Alfredo', 'pasta'),
    (22, 18.75, 'Linguine alle Vongole', 'pasta'),
    (23, 18.25, 'Lasagna', 'pasta'),
    (24, 6.95, 'Tiramisu', 'desserts'),
    (25, 6.95, 'Pan di Stelle', 'desserts'),
    (26, 6.5, 'Affogato al Caffe', 'desserts'),
    (27, 7.25, 'Panna Cotta', 'desserts'),
    (28, 7.95, 'Torta della Nona', 'desserts'),
    (29, 7.95, 'Torta di Mele', 'desserts'),
    (30, 3.5, 'Water', 'softdrinks'),
    (31, 3.5, 'Coca Cola', 'softdrinks'),
    (32, 3.5, 'Limonata', 'softdrinks'),
    (33, 3.5, 'Aranciata', 'softdrinks'),
    (34, 4.75, 'Peroni Beer', 'drinks'),
    (35, 6.5, 'Prosecco', 'drinks'),
    (36, 7.25, 'Red Wine', 'drinks'),
    (37, 7.25, 'White Wine', 'drinks'),
    (38, 7.25, 'Rose Wine', 'drinks'),
    (39, 12.75, 'Aperol Spritz', 'drinks'),
    (40, 12.75, 'Negroni', 'drinks'),
    (41, 12.75, 'Tiramisu Espresso Martini', 'drinks'),
    (42, 9.5, 'Bellini', 'drinks'),
    (43, 2.95, 'Limoncello', 'coffee'),
    (44, 2.95, 'Amaro Montenegro', 'coffee'),
    (45, 2, 'Espresso', 'coffee'),
    (46, 2.5, 'Macchiato', 'coffee'),
    (47, 3, 'Latte', 'coffee'),
    (48, 3, 'Cappuccino', 'coffee'),
    (49, 3, 'Flat White', 'coffee'),
    (50, 2.95, 'Americano', 'coffee')

    ON CONFLICT (id) DO NOTHING;
    `;
  // Optional statement for resetting a table and its dependent tables. Disabled for safety
  //const dropTable = `DROP TABLE IF EXISTS items CASCADE;`;

  try {
    // Table creation respecting the foreign key dependencies in the order of creation
    //await db.query(dropTable);
    await db.query(usersTable);
    await db.query(ordersTable);
    await db.query(itemsTable);
    await db.query(ordersItemsTable);
    await db.query(cartsTable);
    await db.query(cartsItemsTable);

    // Menu items added to the items table
    await db.query(updateMenu);
    console.log("Database initialized");
  } catch (err) {
    console.error("Database setup failed:", err);
  } finally {
    db.end(); // Connection pool is closed at the end of the database initialization
  }
}

setupDatabase();
