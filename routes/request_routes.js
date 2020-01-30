const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const { reset, generateUniqueLink } = require("../controllers/request_controllers");

router.post('/reset', reset);
router.post('/request', generateUniqueLink)

module.exports = router;