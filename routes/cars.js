var express = require("express");
const { verifyToken } = require("../controllers/auth-controller");
const {
  addNewCar,
  deleteCar,
  updateCar,
} = require("../controllers/cars-controller");
var router = express.Router();

router.post("/", verifyToken, addNewCar);
router.delete("/", verifyToken, deleteCar);
router.patch("/", verifyToken, updateCar);

module.exports = router;
