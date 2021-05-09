var express = require("express");
const { addNewComment } = require("../controllers/comments-controller");
var router = express.Router();

router.post("/", addNewComment);

module.exports = router;
