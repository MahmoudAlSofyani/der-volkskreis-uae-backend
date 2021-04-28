var express = require("express");
const {
  addNewCar,
  deleteCar,
  updateCar,
} = require("../controllers/cars-controller");
var router = express.Router();

router.post("/", addNewCar);
router.delete("/", deleteCar);
router.patch("/", updateCar);

module.exports = router;
