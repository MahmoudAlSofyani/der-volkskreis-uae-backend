var express = require("express");
const { verifyIsAdmin } = require("../controllers/auth-controller");
const { createNewSponsor } = require("../controllers/sponsors-controller");
var router = express.Router();

router.post("/", verifyIsAdmin, createNewSponsor);

module.exports = router;
