const express = require("express");
const router = express.Router();

router.use("/users", require("./user_routes"));
router.use("/presenters", require("./presenter_routes"));
router.use("/events", require("./event_routes"));
router.use("/email", require('./email_routes'));
router.use('/image', require('./image_routes'));
router.use('/password', require('./request_routes'));
// router.get("/", require("../controllers/index"));

module.exports = router;
