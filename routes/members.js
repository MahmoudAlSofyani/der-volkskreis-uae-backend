var express = require("express");
const {
  addNewMember,
  getAllMembers,
  searchMember,
  deleteMember,
  updateMember,
  updateMemberRoles,
  deleteCar,
  getMemberById,
  getMemberStatusById,
  getMemberRoleById,
  getMemberBrowniePointsById,
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

router.get("/:id", verifyToken, getMemberById);

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
router.get("/status/:id", verifyToken, getMemberStatusById);
router.post("/role", verifyToken, getMemberRoleById);
router.get("/brownie-points/:id", verifyToken, getMemberBrowniePointsById);
module.exports = router;
