const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const { index, createPresenter, updatePresenter, deletePresenter, findPresenterByName, findPresenterById, findManyPresenters } = require("../controllers/presenter_controllers");

router.get('/', index);
router.get('/:id', findPresenterById);
router.post('/create', middleware.checkAdminToken, createPresenter);
router.patch('/update', middleware.checkAdminToken, updatePresenter);
router.delete('/delete', middleware.checkAdminToken, deletePresenter);
router.get('/find/:query', middleware.checkAdminToken, findPresenterByName);
router.get('/findmany/:query', middleware.checkAdminToken, findManyPresenters);

module.exports = router;