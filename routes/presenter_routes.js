const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const { createPresenter } = require("../controllers/presenter_controllers");

router.post('/create', createPresenter);

module.exports = router;