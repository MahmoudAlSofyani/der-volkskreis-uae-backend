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

exports.sendVerificationEmail = (firstName, lastName, emailAddress) => {
  try {
    const email = new Email({
      transport: transporter,
      send: true,
      preview: false,
    });

    email
      .send({
        template: "signup",
        message: {
          from: "Der Volkskreis UAE <info@volkskreisuae.com>",
          to: `${firstName} ${lastName} <${emailAddress}>`,
          attachments,
        },
        locals: {
          title: "Verification Status - Der Volkskreis UAE",
          firstName,
        },
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

exports.sendAlertToAdmins = () => {
  try {
    const emailAddress = [
      process.env.ADMIN_EMAIL_ONE,
      process.env.ADMIN_EMAIL_TWO,
      process.env.ADMIN_EMAIL_THREE,
      process.env.ADMIN_EMAIL_FOUR,
    ];

    const email = new Email({
      transport: transporter,
      send: true,
      preview: false,
    });

    email
      .send({
        template: "signup-admin",
        message: {
          from: "Der Volkskreis UAE <info@volkskreisuae.com>",
          to: "DVU Admin <admin@volkskreisuae.com>",
          bcc: emailAddress,
          attachments,
        },
        locals: {
          title: "Verification Pending - Der Volkskreis UAE",
        },
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

exports.sendApprovedEmail = (firstName, lastName, emailAddress) => {
  try {
    const email = new Email({
      transport: transporter,
      send: true,
      preview: false,
    });

    email
      .send({
        template: "approved",
        message: {
          from: "Der Volkskreis UAE <info@volkskreisuae.com>",
          to: `${firstName} ${lastName} <${emailAddress}>`,
          attachments,
        },
        locals: {
          title: "Congratulations - Der Volkskreis UAE",
          firstName,
        },
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};
