var express = require("express");
const {
  createPost,
  getAllPost,
  getPostById,
} = require("../controllers/posts-controller");
var router = express.Router();

router.get("/", getAllPost);
router.get("/:id", getPostById);
router.post("/", createPost);

module.exports = router;
