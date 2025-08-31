# Italian Restaurant Backend
This project is a **Node.js + Express + Passport.js** backend that simulates the typical functionality of an ecommerce website, more in particular the backend of an Italian restaurant that allows placing orders online. It allows users to create accounts, view items on the menu, create/edit a shopping cart, and place/view orders.


## Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/elenadfm19/E-Commerce_Backend.git
cd italian-restaurant-backend
npm install
```

## Running the app
This project requires a [PostgreSQL](https://www.postgresql.org/) database to be running locally. Edit the file `.env` which contains important environment variables and replace the values of those specific to your local database (variables starting with 'DB_'). Once PostgreSQL is running you can initialize the database with the right tablse with any of those 2 commands:`npm run create-db` or `node dbInit.js`

To run the app use any of these commands: `npm run start` of `node app.js`

Now the API can be accessed on `http://localhost:<your-port>`


## Testing
You can use a HTTP client such as [Postman](https://www.postman.com/) to make requests to the API endpoints.

**Note:** Most of the endpoints are protected and require authentication.  In order to properly access them, you will need to have a session cookie present when making your request. This is achieved by hitting the `/user/login` endpoint first.

You can test the following endpoints:

### Authentication
| Method | Endpoint          | Description                   |
|--------|-------------------|-------------------------------|
| POST   | `/users/register` | Register a new user           |
| POST   | `/users/login`    | Login with email & password   |
| POST   | `/users/logout`   | Logout current user           |
| GET   | `/users/profile`   | View current user profile     |
| DELETE | `/users/delete`   | Delete logged-in user profile |

### Menu
| Method | Endpoint  | Description                 |
|--------|-----------|-----------------------------|
| GET    | `/menu`   | View the restaurant´s menu  |

### Shopping Cart 
| Method | Endpoint                   | Description                            |
|--------|----------------------------|----------------------------------------|
| POST   | `/cart/newCart`            | Create a new shopping cart             |
| GET    | `/cart`                    | View summary of the shopping cart      |
| GET    | `/cart/:cartId`            | View details of the items in the cart  |
| PUT    | `/cart/addItem/:itemId`    | Add an item to the a cart              |
| PUT    | `/cart/deleteItem/:itemId` | Delete an item from the cart           |

### Orders
| Method | Endpoint             | Description                                  |
|--------|----------------------|----------------------------------------------|
| POST   | `/orders/neworder`   | Place an order from a cart                   |
| GET    | `/orders`            | View a sumnmary of all user’s orders         |
| GET    | `/orders/:orderId`   | View details of the items in specific order  |
