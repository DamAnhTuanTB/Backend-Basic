const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();

router.use(auth);
module.exports = router;
