var express = require("express");
const { loginMember, verifyValidToken } = require("../controllers/auth-controller");
var router = express.Router();

router.post("/login", loginMember);
router.get("/verify-token", verifyValidToken)

module.exports = router;
