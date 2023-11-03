const express = require("express");

const router = express.Router();

const {
  fetchAllCategories,
  createCategory,
} = require("../controller/Category");

router.post("/", createCategory).get("/", fetchAllCategories);

exports.router = router;
