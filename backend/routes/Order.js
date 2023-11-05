const express = require("express");

const router = express.Router();

const { createOrder, fetchOrderByUser, updateOrder } = require("../controller/Order");

router
  .post("/", createOrder)
  .get("/:id", fetchOrderByUser)
  .patch("/:id", updateOrder);

exports.router = router;
