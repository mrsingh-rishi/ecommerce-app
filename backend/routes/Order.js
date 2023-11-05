const express = require("express");

const router = express.Router();

const { createOrder, fetchOrderByUser, updateOrder, fetchAllOrders } = require("../controller/Order");

router
  .post("/", createOrder)
  .get("/:id", fetchOrderByUser)
  .get("/", fetchAllOrders)
  .patch("/:id", updateOrder);

exports.router = router;
