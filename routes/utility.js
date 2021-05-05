var express = require("express");
const { verifyIsAdmin } = require("../controllers/auth-controller");
const {
  addNewCarModel,
  getCarModels,
  getCarColors,
  getPlateEmirates,
  getPlateCodes,
  getActiveMemberCount,
  getInactiveMemberCount,
} = require("../controllers/utility-controller");
var router = express.Router();

router.post("/car-model", addNewCarModel);
router.get("/car-models", getCarModels);
router.get("/car-colors", getCarColors);
router.get("/plate-emirates", getPlateEmirates);
router.get("/plate-codes", getPlateCodes);
router.get("/member-count", getActiveMemberCount);
router.get("/member-count/inactive", getInactiveMemberCount);

module.exports = router;
