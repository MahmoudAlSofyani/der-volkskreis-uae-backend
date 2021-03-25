var express = require("express");
const {
  addNewUser,
  getAllUsers,
  searchUser,
  deleteUser,
  updateUser,
} = require("../controllers/user-controller");
const { userValidator } = require("../validators/users-validators");
const processValidations = require("../utilities/process-validations");
var router = express.Router();

// CRUD Operations

// Add new user *
// Get specific user *
// Get all users *
// Update user *
// Delete user *

router.post("/", userValidator("addNewUser"), processValidations, addNewUser);
router.post(
  "/search",
  userValidator("searchUser"),
  processValidations,
  searchUser
);
router.get("/", getAllUsers);
router.delete("/", userValidator("deleteUser"), processValidations, deleteUser);
router.patch("/", userValidator("updateUser"), processValidations, updateUser);
module.exports = router;
