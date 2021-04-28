var express = require("express");
const {
  addNewMember,
  getAllMembers,
  searchMember,
  deleteMember,
  updateMember,
  updateMemberRoles,
  deleteCar,
} = require("../controllers/members-controller");
const { membersValidator } = require("../validators/members-validator");
const processValidations = require("../utilities/process-validations");
var router = express.Router();

// CRUD Operations

// Add new user *
// Get specific user *
// Get all users *
// Update user *
// Delete user *

router.post(
  "/",
  membersValidator("addNewMember"),
  processValidations,
  addNewMember
);
router.post(
  "/search",
  membersValidator("searchMember"),
  processValidations,
  searchMember
);
router.get("/", getAllMembers);
router.delete(
  "/",
  membersValidator("deleteMember"),
  processValidations,
  deleteMember
);
// router.patch(
//   "/",
//   membersValidator("updateMember"),
//   processValidations,
//   updateMember
// );

router.put("/update-roles", updateMemberRoles);
module.exports = router;
