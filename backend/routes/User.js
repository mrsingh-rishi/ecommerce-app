const express = require("express");

const router = express.Router();

const { updateUser, fetchUserById } = require("../controller/User");

router.get("/", fetchUserById).patch("/", updateUser);

exports.router = router;
