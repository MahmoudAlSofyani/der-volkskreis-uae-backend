require("dotenv").config();

const Email = require("email-templates");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

const attachments = [
  {
    filename: "dvu-logo.png",
    path: "./public/images/dvu-logo.png",
    cid: "duv-logo",
  },
  {
    filename: "instagram-icon.png",
    path: "./public/icons/instagram-icon.png",
    cid: "instagram",
  },
  {
    filename: "3w.png",
    path: "./public/images/3w.png",
    cid: "3whealthcare",
  },
  {
    filename: "alnaboodah1.png",
    path: "./public/images/alnaboodah1.png",
    cid: "vwdubai",
  },
  {
    filename: "rowe.png",
    path: "./public/images/rowe.png",
    cid: "rowe",
  },
];

exports.sendNewAnnouncementEmail = (emailAddresses) => {
  try {
    const email = new Email({
      transport: transporter,
      send: true,
      preview: false,
    });

    email
      .send({
        template: "announcement",
        message: {
          from: "Der Volkskreis UAE <info@volkskreisuae.com>",
          to: emailAddresses,
          attachments,
        },
        locals: {
          title: "New Announcement",
        },
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};
