const express = require('express');

const router = express.Router();

const { createProduct } = require('../controller/Product');

router.post('/', createProduct);

exports.router = router;