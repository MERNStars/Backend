const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const {createEvent, index, update, deleteEvent, findEventByKeywords} = require('../controllers/event_controllers');

router.get('/', index);
router.get('/:keywords', findEventByKeywords);
router.post('/create', middleware.checkAdminToken, createEvent);
router.patch('/update', middleware.checkAdminToken, update);
router.delete('/delete', middleware.checkAdminToken, deleteEvent);

module.exports = router;