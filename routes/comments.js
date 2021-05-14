var express = require("express");
const { verifyToken } = require("../controllers/auth-controller");
const { addNewComment } = require("../controllers/comments-controller");
var router = express.Router();

router.post("/", verifyToken, addNewComment);

module.exports = router;
