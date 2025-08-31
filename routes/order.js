const express = require("express");
const router = express.Router();
const OrderModel = require("../models/orderModel.js");
// Middleware that ensures user is logged in before accessing routes
const verifyAuthentication = require("../middleware/verifyAuthentication.js");

/*
  @route POST /orders/newOrder
  @desc  Creates a new order for the authenticated user from the existing cart.
         The existing cart will be deleted once the order is placed.
*/
router.post("/neworder", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderCreated = await OrderModel.create(userId);
    if (orderCreated) {
      res.status(200).send("Order created");
    } else {
      res.status(404).send("Cart is empty. Order cannot be created");
    }
  } catch (err) {
    next(err);
  }
});

/*
  @route GET /orders
  @desc  Retrieves the status of all the orders placed by the authenticated user´s cart.
         Returns: total cost, number of itmes, creation date.
*/
router.get("/", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const results = await OrderModel.findByUserId(userId);
    res.status(200).send(results);
  } catch (err) {
    next(err);
  }
});

//Retrieves the details of the items in an order for a specific order id
/*
  @route GET /orders/:orderId
  @desc  Retrieves the details of all the items in an order by orderId
*/
router.get("/:orderId", verifyAuthentication, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const results = await OrderModel.findByOrderId(orderId);
    res.status(200).send(results);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
