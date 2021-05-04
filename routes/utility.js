var express = require("express");
const {
  addNewCarModel,
  getCarModels,
  getCarColors,
  getPlateEmirates,
  getPlateCodes,
} = require("../controllers/utility-controller");
var router = express.Router();

router.post("/car-model", addNewCarModel);
router.get("/car-models", getCarModels);
router.get("/car-colors", getCarColors);
router.get("/plate-emirates", getPlateEmirates);
router.get("/plate-codes", getPlateCodes);

module.exports = router;
