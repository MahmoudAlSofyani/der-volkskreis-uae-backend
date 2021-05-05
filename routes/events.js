var express = require("express");
const {
  verifyToken,
  verifyIsAdmin,
} = require("../controllers/auth-controller");
const {
  getAllEvents,
  createEvent,
  registerForEvent,
  getAttendeesByEventId,
  checkIfMemberIsRegisteredForEventById,
  getEventById,
  editEvent,
} = require("../controllers/events-controller");
var router = express.Router();

router.get("/", verifyToken, getAllEvents);
router.get("/:eventId", verifyIsAdmin, getEventById);
router.get("/attendees/:eventId", verifyIsAdmin, getAttendeesByEventId);
router.post("/", verifyIsAdmin, createEvent);
router.post("/register", verifyToken, registerForEvent);
router.post("/check", verifyToken, checkIfMemberIsRegisteredForEventById);
router.patch("/", verifyIsAdmin, editEvent);

module.exports = router;
