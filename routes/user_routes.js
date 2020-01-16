const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const { index, createUser, findOneUser, login , deleteUser, subscribe, unsubscribe, remark} = require("../controllers/user_controllers");

router.get('/', index);
router.post('/create', createUser);

//upon delete the token should also be deleted at the client's side
router.delete('/delete/:username', middleware.checkToken, deleteUser);
router.get('/:username', middleware.checkToken, findOneUser);
router.patch('/subscribe/:username', middleware.checkToken, subscribe);
router.patch('/unsubscribe/:username', middleware.checkToken, unsubscribe);
router.patch('/remark', middleware.checkAdminToken, remark);
router.post('/login', login);

module.exports = router;