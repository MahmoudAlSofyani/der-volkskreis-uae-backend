var express = require("express");
const {
  getAllAnnouncements,
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
} = require("../controllers/announcements-controller");
const {
  verifyIsAdmin,
  verifyToken,
} = require("../controllers/auth-controller");
var router = express.Router();

router.get("/", verifyToken, getAllAnnouncements);
router.get("/:eventId", verifyToken, getAnnouncementById);
router.post("/", verifyIsAdmin, createAnnouncement);
router.patch("/", verifyIsAdmin, editAnnouncement);
router.delete("/", verifyIsAdmin, deleteAnnouncement);

module.exports = router;
