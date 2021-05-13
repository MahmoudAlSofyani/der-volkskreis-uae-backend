var express = require("express");
const {
  createPost,
  getAllPost,
  getPostById,
  searchPost,
} = require("../controllers/posts-controller");
var router = express.Router();

router.get("/", getAllPost);
router.get("/:id", getPostById);
router.post("/", createPost);
router.post("/search", searchPost);

module.exports = router;
