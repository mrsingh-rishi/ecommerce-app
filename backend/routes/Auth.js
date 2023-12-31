const express = require("express");
const router = express.Router();
const { createUser, loginUser, checkUser, logout } = require("../controller/Auth");
const passport = require("passport");

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/logout", logout)
  .get("/check", passport.authenticate("jwt"), checkUser);

exports.router = router;
