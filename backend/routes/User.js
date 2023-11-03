const express = require("express");

const router = express.Router();

const { updateUser, fetchUserById } = require("../controller/User");

router.get("/:id", fetchUserById).patch("/:id", updateUser);

exports.router = router;
