const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const { index, createPresenter, updatePresenter, deletePresenter } = require("../controllers/presenter_controllers");

router.get('/', middleware.checkAdminToken, index);
router.post('/create', middleware.checkAdminToken, createPresenter);
router.patch('/update', middleware.checkAdminToken, updatePresenter);
router.delete('/delete', middleware.checkAdminToken, deletePresenter);

module.exports = router;