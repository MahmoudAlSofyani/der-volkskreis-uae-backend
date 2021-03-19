var express = require("express");
const { addNewUser, getAllUsers } = require("../controllers/user-controller");
const { userValidator } = require("../validators/users-validators");
const processValidations = require("../utilities/process-validations");
var router = express.Router();

// CRUD Operations

// Add new user *
// Get specific user
// Get all users *
// Update user
// Delete user

router.post("/", userValidator("addNewUser"), processValidations, addNewUser);
router.get("/", getAllUsers);
module.exports = router;
