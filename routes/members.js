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
const {
  verifyToken,
  verifyIsAdmin,
} = require("../controllers/auth-controller");
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
  verifyIsAdmin,
  membersValidator("searchMember"),
  processValidations,
  searchMember
);
router.get("/", verifyIsAdmin, getAllMembers);
router.delete(
  "/",
  verifyIsAdmin,
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

router.put("/update-roles", verifyIsAdmin, updateMemberRoles);
module.exports = router;
