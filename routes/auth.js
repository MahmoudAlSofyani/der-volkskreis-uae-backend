var express = require("express");
const { loginMember } = require("../controllers/auth-controller");
var router = express.Router();

router.post("/login", loginMember);

module.exports = router;
