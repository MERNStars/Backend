const express = require('express');
const router = express.Router();
const { sendEmail } = require("../controllers/email_controllers");


router.post('/', sendEmail);

module.exports = router