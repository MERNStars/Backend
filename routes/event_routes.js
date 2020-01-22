const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const {createEvent, index, update, deleteEvent, findEventByKeywords, findEventById, findEventCategory, attendEvent, unattendEvent} = require('../controllers/event_controllers');

router.get('/', index);
router.get('/:keywords', findEventByKeywords);
router.get('/:id/id', findEventById);
router.get('/category/:keywords', findEventCategory);
router.post('/create', middleware.checkAdminToken, createEvent);
router.patch('/update', middleware.checkAdminToken, update);
router.patch('/attend', middleware.checkAdminToken, attendEvent);
router.patch('/unattend', middleware.checkAdminToken, unattendEvent);
router.delete('/delete', middleware.checkAdminToken, deleteEvent);

module.exports = router;