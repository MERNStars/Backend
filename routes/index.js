const express = require('express');
const router = express.Router();

router.use('/users', require('./user_routes'));
// router.use('/hosts', require('./host_routes'));
// router.use('/events', require('./event_routes'));
// router.get("/", require("../controllers/index"));

module.exports = router;
