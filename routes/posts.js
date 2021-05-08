var express = require("express");
const { createPost, getAllPost } = require("../controllers/posts-controller");
var router = express.Router();

router.get("/", getAllPost);
router.post("/", createPost);

module.exports = router;
