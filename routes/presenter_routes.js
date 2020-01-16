const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const { index, createPresenter } = require("../controllers/presenter_controllers");

router.get('/', middleware.checkAdminToken, index);
router.post('/create', middleware.checkAdminToken, createPresenter);

module.exports = router;