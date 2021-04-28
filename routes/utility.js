var express = require("express");
const { addNewCarModel } = require("../controllers/utility-controller");
var router = express.Router();

router.post("/car-model", addNewCarModel);

module.exports = router;
