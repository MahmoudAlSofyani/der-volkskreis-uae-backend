var express = require("express");
const {
  getAllEvents,
  createEvent,
  registerForEvent,
  getAttendeesByEventId,
} = require("../controllers/events-controller");
var router = express.Router();

router.get("/", getAllEvents);
router.get("/:eventId", getAttendeesByEventId);
router.post("/", createEvent);
router.post("/register", registerForEvent);

module.exports = router;
