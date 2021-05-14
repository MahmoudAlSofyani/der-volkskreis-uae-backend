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
  updateMemberProfilePicture,
} = require("../controllers/members-controller");
const { membersValidator } = require("../validators/members-validator");
const processValidations = require("../utilities/process-validations");
const {
  verifyToken,
  verifyIsAdmin,
} = require("../controllers/auth-controller");
const { uploadSingleImage } = require("../controllers/file-controller");
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

  searchMember
);
// Add verifyIsAdmin Middleware here after testing
router.get("/", verifyToken, getAllMembers);

router.delete(
  "/",
  verifyIsAdmin,
  membersValidator("deleteMember"),
  processValidations,
  deleteMember
);

router.patch("/", verifyToken, updateMember);

router.put("/update-roles", verifyIsAdmin, updateMemberRoles);
router.get("/status/:id", verifyToken, getMemberStatusById);
router.post("/role", verifyToken, getMemberRoleById);
router.get("/brownie-points/:id", verifyToken, getMemberBrowniePointsById);
router.put(
  "/update-profile-picture",
  verifyToken,
  uploadSingleImage,
  updateMemberProfilePicture
);
module.exports = router;
