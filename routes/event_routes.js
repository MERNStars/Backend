const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const {createEvent, index, update} = require('../controllers/event_controllers');

router.get('/', index);
router.post('/create', middleware.checkAdminToken, createEvent);
router.patch('/update', middleware.checkAdminToken, update);

module.exports = router;