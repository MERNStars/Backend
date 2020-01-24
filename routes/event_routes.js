const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const {createEvent, index, update, publish, deleteEvent, findEventByKeywords, findEventById, findEventCategory, attendEvent, unattendEvent, getEventAttendees, getImageUrl, togglePublish, statusUpdate} = require('../controllers/event_controllers');


router.get('/', index);
router.get('/:keywords', findEventByKeywords);
router.get('/:id/id', findEventById);
router.get('/:id/attendees', middleware.checkAdminToken, getEventAttendees);
router.get('/category/:keywords', findEventCategory);
router.post('/create', middleware.checkAdminToken, createEvent);
router.patch('/update', middleware.checkAdminToken, update);
router.patch('/publish', middleware.checkAdminToken, togglePublish);
router.patch('/status', middleware.checkAdminToken, statusUpdate);
router.patch('/attend', middleware.checkAdminToken, attendEvent);
router.patch('/unattend', middleware.checkAdminToken, unattendEvent);
router.delete('/delete/:id', middleware.checkAdminToken, deleteEvent);

module.exports = router;