var express = require("express");
const {
  verifyIsAdmin,
  verifyToken,
} = require("../controllers/auth-controller");
const { downloadFile } = require("../controllers/file-controller");
const {
  addNewCarModel,
  getCarModels,
  getCarColors,
  getPlateEmirates,
  getPlateCodes,
  getActiveMemberCount,
  getInactiveMemberCount,
  getUnverifiedMembers,
  getSponsorCount,
} = require("../controllers/utility-controller");
var router = express.Router();

router.post("/car-model", addNewCarModel);
router.get("/car-models", getCarModels);
router.get("/car-colors", getCarColors);
router.get("/plate-emirates", getPlateEmirates);
router.get("/plate-codes", getPlateCodes);
router.get("/member-count", verifyIsAdmin, getActiveMemberCount);
router.get("/member-count/inactive", verifyIsAdmin, getInactiveMemberCount);
router.get("/members-unverified", verifyIsAdmin, getUnverifiedMembers);
router.get("/file/:id", downloadFile);
router.get("/sponsors-count", verifyIsAdmin, getSponsorCount);

module.exports = router;
