var express = require("express");
const {
  createAdvertisement,
  updateAdvertisementVerificationStatus,
  updateAdvertisementStatus,
  getAllAdvertisements,
} = require("../controllers/advertisements-controller");
const { uploadSingleImage } = require("../controllers/file-controller");
var router = express.Router();

router.post("/", uploadSingleImage, createAdvertisement);
router.put("/", updateAdvertisementVerificationStatus);
router.put("/status", updateAdvertisementStatus);
router.get("/:isVerified", getAllAdvertisements);

module.exports = router;
