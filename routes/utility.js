var express = require("express");
var router = express.Router();

router.get("/", seedDatabase);

module.exports = router;
