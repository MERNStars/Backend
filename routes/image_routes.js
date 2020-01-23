const express = require('express');
const router = express.Router();
const {getImageUrl} = require('../controllers/image_controllers');
const middleware = require('./token_middleware');

router.post('/geturl', middleware.checkToken, getImageUrl);

module.exports = router