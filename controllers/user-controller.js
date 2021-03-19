const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

exports.addNewUser = (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      emailAddress,
      password,
    } = req.body;

    prisma.user
      .findFirst({ where: { emailAddress } })
      .then((_existingUser) => {
        if (_existingUser) {
          const error = new Error();
          error.message = "User already exists";
          error.status = 404;
          next(error);
        } else {
          bcrypt
            .hash(password, 12)
            .then((_hashedPassword) => {
              if (_hashedPassword) {
                prisma.user
                  .create({
                    data: {
                      firstName,
                      lastName,
                      mobileNumber,
                      emailAddress,
                      password: _hashedPassword,
                      authenticationToken: "",
                    },
                  })
                  .then((_newUser) => {
                    if (_newUser) {
                      const token = jwt.sign(
                        _newUser.id,
                        "supersecretpassword"
                      );

                      prisma.user
                        .update({
                          where: { id: _newUser.id },
                          data: { authenticationToken: token },
                        })
                        .then((_newUser) => {
                          if (_newUser) {
                            res.status(200).send(_newUser);
                          }
                        })
                        .catch((err) => console.error(err));
                    }
                  })
                  .catch((err) => console.error(err));
              }
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
  }
};

exports.getAllUsers = (req, res, next) => {
  try {
    prisma.user
      .findMany()
      .then((_users) => {
        res.status(200).send(_users);
      })
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
  }
};
