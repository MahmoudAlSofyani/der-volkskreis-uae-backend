var express = require("express");
const {
  createAdvertisement,
  updateAdvertisementVerificationStatus,
  updateAdvertisementStatus,
  getAllAdvertisements,
  deleteAdvertisement,
} = require("../controllers/advertisements-controller");
const {
  verifyToken,
  verifyIsAdmin,
} = require("../controllers/auth-controller");
const { uploadSingleImage } = require("../controllers/file-controller");
var router = express.Router();

router.post("/", verifyToken, uploadSingleImage, createAdvertisement);
router.put("/", verifyIsAdmin, updateAdvertisementVerificationStatus);
router.put("/status", verifyToken, updateAdvertisementStatus);
router.get("/:isVerified", verifyToken, getAllAdvertisements);
router.delete("/:id", verifyIsAdmin, deleteAdvertisement);

module.exports = router;
