const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.generateError = (message, req, next) => {
  const error = new Error();
  error.message = message;
  error.status = 500;
  next(error);
};

exports.generatDefaultError = (err, req, next) => {
  const error = new Error();
  error.message = "Server error, please try again";
  error.stack = err;
  error.status = 500;
  next(error);
};

exports.imagesFileFilter = (req, file, cb) => {
  try {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = "Only images are allowed";
      return cb(new Error("Only images are allowed"), false);
    }

    cb(null, true);
  } catch (err) {
    console.log(err);
  }
};

exports.getAllEmails = async () => {
  try {
    const _emails = await prisma.member.findMany();

    if (_emails) {
      let _emailAddresses = [];

      _emails.forEach((_email) => {
        _emailAddresses.push(_email.emailAddress);
      });

      return _emailAddresses;
    }
  } catch (err) {
    console.log(err);
  }
};
