require("dotenv").config();

const EmailTemplate = require("email-templates");

exports.sendVerificationEmail = (firstName, emailAddress) => {
  try {
    let emailToSend;

    emailToSend = new EmailTemplate({
      message: {
        from: "Verification - Der Volkskreis UAE <verification@volkskreisuae.com>",
      },
      transport: {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: true,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    });

    emailToSend
      .send({
        template: "signup",
        message: {
          to: emailAddress,
          attachments: [
            {
              filename: "dvu-logo.png",
              path: "./public/images/dvu-logo.png",
              cid: "duvlogo",
            },
            {
              filename: "instagram-icon.png",
              path: "./public/icons/instagram-icon.png",
              cid: "instagram",
            },
          ],
        },
        locals: {
          title: "Verification Status - Der Volkskreis UAE",
          firstName,
        },
      })
      .then((_email) => {
        return _email;
      });
  } catch (err) {
    console.log(err);
  }
};

exports.sendAlertToAdmins = () => {
  try {
    let emailToSend;

    const emailAddress = [
      "danish.shakeel_m@hotmail.com",
      "msafar95@hotmail.com",
      "ahmed.h.alhosanii@gmail.com",
      "abdulla.albakr@hotmail.com",
      "nicola.bourji@gmail.com",
    ];

    emailToSend = new EmailTemplate({
      message: {
        from: "Verification - Der Volkskreis UAE <verification@volkskreisuae.com>",
      },
      transport: {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: true,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    });

    emailToSend
      .send({
        template: "signup-admin",
        message: {
          to: "admin@volkskreisuae",
          bcc: emailAddress,
          attachments: [
            {
              filename: "dvu-logo.png",
              path: "./public/images/dvu-logo.png",
              cid: "duvlogo",
            },
            {
              filename: "instagram-icon.png",
              path: "./public/icons/instagram-icon.png",
              cid: "instagram",
            },
          ],
        },
        locals: {
          title: "Verification Pending - Der Volkskreis UAE",
        },
      })
      .then((_email) => {
        return _email;
      });
  } catch (err) {
    console.log(err);
  }
};

exports.sendApprovedEmail = (firstName, emailAddress) => {
  try {
    let emailToSend;

    emailToSend = new EmailTemplate({
      message: {
        from: "Verification - Der Volkskreis UAE <verification@volkskreisuae.com>",
      },
      preview: {
        open: {
          app: "chrome",
          wait: false,
        },
      },
      transport: {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: true,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    });

    emailToSend
      .send({
        template: "approved",
        message: {
          to: emailAddress,
          attachments: [
            {
              filename: "dvu-logo.png",
              path: "./public/images/dvu-logo.png",
              cid: "duvlogo",
            },
            {
              filename: "instagram-icon.png",
              path: "./public/icons/instagram-icon.png",
              cid: "instagram",
            },
          ],
        },
        locals: {
          title: "Verification Status - Der Volkskreis UAE",
          firstName,
        },
      })
      .then((_email) => {
        return _email;
      });
  } catch (err) {
    console.log(err);
  }
};
