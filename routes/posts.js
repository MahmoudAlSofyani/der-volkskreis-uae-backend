var express = require("express");
const { verifyToken } = require("../controllers/auth-controller");
const {
  createPost,
  getAllPost,
  getPostById,
  searchPost,
} = require("../controllers/posts-controller");
var router = express.Router();

router.get("/", verifyToken, getAllPost);
router.get("/:id", verifyToken, getPostById);
router.post("/", verifyToken, createPost);
router.post("/search", verifyToken, searchPost);

module.exports = router;
