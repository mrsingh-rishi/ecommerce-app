const express = require("express");

const router = express.Router();

const { createUser, loginUser } = require("../controller/Auth");

router
  .post("/signup", createUser).post('/login', loginUser);

exports.router = router;
