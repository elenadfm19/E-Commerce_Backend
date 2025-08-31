const express = require('express');
const router = express.Router();
const MenuModel = require("../models/menuModel.js");

//Retrieves the items on the menu
/*
  @route GET /menu
  @desc  Retrieves all the items on the menu
*/
router.get("/", async (req, res, next) => {
    try {
        const menu=await MenuModel.viewMenu();
        res.status(200).send(menu);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
