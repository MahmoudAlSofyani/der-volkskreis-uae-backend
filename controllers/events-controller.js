const { PrismaClient } = require("@prisma/client");
const {
  generateError,
  generatDefaultError,
  getAllEmails,
} = require("../helpers/common");
const prisma = new PrismaClient();
const moment = require("moment");
const { sendNewEventEmail } = require("../helpers/emailer/events");

// dont create a new event status if member and event id combination already exists

const membersPublicAttributes = {
  id: true,
  firstName: true,
  lastName: true,
  emailAddress: true,
  mobileNumber: true,
  whatsAppNumber: true,
  password: false,
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        date: true,
        meetingPoint: true,
        meetingTime: true,
        details: true,
        members: {
          select: membersPublicAttributes,
        },
      },
    });

    if (events) {
      res.status(200).send(events);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const _event = await prisma.event.findUnique({ where: { id: eventId } });

    if (_event) {
      res.status(200).send(_event);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getAttendeesByEventId = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const _attendees = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        members: {
          select: membersPublicAttributes,
        },
      },
    });

    if (_attendees && _attendees.members.length > 0)
      res.status(200).send(_attendees);
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { name, date, meetingPoint, meetingTime, details } = req.body;

    const newEvent = await prisma.event.create({
      data: {
        name,
        date: moment(date).format(),
        meetingPoint,
        meetingTime,
        details,
      },
    });

    if (newEvent) {
      let emails = await getAllEmails();

      await sendNewEventEmail(emails);

      res.status(200).send(newEvent);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.editEvent = async (req, res, next) => {
  try {
    const { id, name, date, meetingPoint, meetingTime, details } = req.body;

    const _event = await prisma.event.update({
      where: { id },
      data: {
        name,
        date: moment(date).format(),
        meetingPoint,
        meetingTime,
        details,
      },
    });

    if (_event) {
      res.status(200).send(_event);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.registerForEvent = async (req, res, next) => {
  try {
    const { memberId, eventId } = req.body;

    const _event = await prisma.event.update({
      where: { id: eventId },
      data: {
        members: {
          connect: {
            id: memberId,
          },
        },
      },
    });

    if (_event) {
      const _eventStatus = await prisma.eventStatus.create({
        data: {
          status: false,
          event: {
            connect: {
              id: eventId,
            },
          },
          member: {
            connect: {
              id: memberId,
            },
          },
        },
      });
      res.status(200).send({ msg: "Successfully registered for the event" });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.checkIfMemberIsRegisteredForEventById = async (req, res, next) => {
  try {
    const { eventId, memberId } = req.body;

    const _event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        members: true,
      },
    });

    if (_event) {
      let _isRegistered = false;
      if (_event.members.some((_member) => _member.id === memberId)) {
        _isRegistered = true;
      }

      res.status(200).send({ _isRegistered });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.updateEventStatus = async (req, res, next) => {
  try {
    const { memberId, eventId, isAttended } = req.body;

    const _eventStatus = await prisma.eventStatus.findFirst({
      where: {
        AND: [
          {
            member: {
              id: memberId,
            },
          },
          {
            event: {
              id: eventId,
            },
          },
        ],
      },
    });

    if (_eventStatus) {
      const { id } = _eventStatus;

      const _updateStatus = await prisma.eventStatus.update({
        where: {
          id,
        },
        data: {
          status: isAttended,
        },
      });

      if (_updateStatus) {
        res.status(200).send(_updateStatus);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
