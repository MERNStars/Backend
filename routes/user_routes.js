const express = require('express');
const router = express.Router();
const middleware = require('./token_middleware');

const { index, createUser, findUserByUsername, login , deleteUser, subscribe, unsubscribe, makeRemark, update, changePassword, accountExists} = require("../controllers/user_controllers");

router.get('/', middleware.checkAdminToken, index);
router.post('/create', createUser);

//upon delete the token should also be deleted at the client's side
router.delete('/delete/:username', middleware.checkToken, deleteUser);
router.get('/:username', middleware.checkToken, findUserByUsername);
router.patch('/subscribe/:username', middleware.checkToken, subscribe);
router.patch('/unsubscribe/:username', middleware.checkToken, unsubscribe);
router.patch('/remark', middleware.checkAdminToken, makeRemark);
router.patch('/update', middleware.checkToken, update);
router.patch('/changePassword', middleware.checkToken, changePassword);
router.post('/login', login);
router.post('/exists', accountExists);

module.exports = router;