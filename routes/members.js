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
  verifyMember,
} = require("../controllers/members-controller");
const { membersValidator } = require("../validators/members-validator");
const processValidations = require("../utilities/process-validations");
const {
  verifyToken,
  verifyIsAdmin,
} = require("../controllers/auth-controller");
var router = express.Router();

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
// Add verifyIsAdmin Middleware here after testing
router.get("/", getAllMembers);

router.delete(
  "/",
  verifyIsAdmin,
  membersValidator("deleteMember"),
  processValidations,
  deleteMember
);

router.patch("/", updateMember);

router.put("/update-roles", verifyIsAdmin, updateMemberRoles);
router.get("/status/:id", verifyToken, getMemberStatusById);
router.post("/role", verifyToken, getMemberRoleById);
router.get("/brownie-points/:id", verifyToken, getMemberBrowniePointsById);
module.exports = router;
