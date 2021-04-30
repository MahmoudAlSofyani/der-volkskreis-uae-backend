var express = require("express");
const {
  getAllAnnouncements,
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcements-controller");
var router = express.Router();

router.get("/", getAllAnnouncements);
router.post("/", createAnnouncement);
router.patch("/", editAnnouncement);
router.delete("/", deleteAnnouncement);

module.exports = router;
