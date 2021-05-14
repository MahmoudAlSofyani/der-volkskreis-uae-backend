const { PrismaClient } = require("@prisma/client");
const {
  generateError,
  generatDefaultError,
  getAllEmails,
} = require("../helpers/common");
const {
  sendNewAnnouncementEmail,
} = require("../helpers/emailer/announcements");
const prisma = new PrismaClient();

exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const _announcements = await prisma.announcement.findMany();

    if (_announcements) {
      res.status(200).send(_announcements);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getAnnouncementById = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const _announcement = await prisma.announcement.findUnique({
      where: { id: eventId },
    });

    if (_announcement) {
      res.status(200).send(_announcement);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, details } = req.body;

    const _newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        details,
      },
    });

    if (_newAnnouncement) {
      let emailAddresses = await getAllEmails();

      await sendNewAnnouncementEmail(emailAddresses);

      res.status(200).send(_newAnnouncement);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.editAnnouncement = async (req, res, next) => {
  try {
    const { id, title, details } = req.body;

    const _announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        details,
      },
    });

    if (_announcement) {
      res.status(200).send(_announcement);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.body;

    const _announcement = await prisma.announcement.delete({ where: { id } });

    if (_announcement) {
      res.status(200).send("Announcement deleted");
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};
