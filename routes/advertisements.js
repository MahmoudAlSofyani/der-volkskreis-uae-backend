var express = require("express");
const {
  createAdvertisement,
  updateAdvertisementVerificationStatus,
  updateAdvertisementStatus,
  getAllAdvertisements,
  deleteAdvertisement,
} = require("../controllers/advertisements-controller");
const { uploadSingleImage } = require("../controllers/file-controller");
var router = express.Router();

router.post("/", uploadSingleImage, createAdvertisement);
router.put("/", updateAdvertisementVerificationStatus);
router.put("/status", updateAdvertisementStatus);
router.get("/:isVerified", getAllAdvertisements);
router.delete("/:id", deleteAdvertisement);

module.exports = router;
