var express = require("express");
const { addNewUser } = require("../controllers/user-controller");
var router = express.Router();

// CRUD Operations

// Add new user
// Get specific user
// Get all users
// Update user
// Delete user

router.post("/", addNewUser);
module.exports = router;
