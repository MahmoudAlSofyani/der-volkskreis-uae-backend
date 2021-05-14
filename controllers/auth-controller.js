const { PrismaClient } = require("@prisma/client");
const { generatDefaultError } = require("../helpers/common");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
const { sendResetPasswordEmail } = require("../helpers/emailer/reset-password");

const publicAttributes = {
  id: true,
  firstName: true,
  lastName: true,
  emailAddress: true,
  mobileNumber: true,
  whatsAppNumber: true,
  password: false,
  createdAt: true,
  updatedAt: false,
  cars: true,
  roles: true,
  events: true,
  browniePoints: true,
  profilePicture: true,
  firstLogin: true,
};
exports.loginMember = async (req, res, next) => {
  try {
    const { emailAddress, password } = req.body;

    const _member = await prisma.member.findFirst({
      where: { emailAddress },
      select: { ...publicAttributes, password: true },
    });

    if (_member) {
      const _passwordVerified = await bcrypt.compare(
        password,
        _member.password
      );

      if (_passwordVerified) {
        const _jwtPayload = {
          id: _member.id,
        };

        const _token = await jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) * (60 * 60),
            data: _jwtPayload,
          },
          process.env.JWT_SECRET
        );

        if (_token) {
          res.status(200).send({ _token, _member });
        }
      } else {
        res.status(401).send({ err: "Invalid email or password" });
      }
    } else {
      res.status(401).send({ err: "Invalid email or password" });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      const _token = authorization.split(" ")[1];

      const _decodedPayload = await jwt.verify(_token, process.env.JWT_SECRET);

      if (_decodedPayload) {
        const { id } = _decodedPayload.data;
        const _member = await prisma.member.findUnique({
          where: { id },
          select: publicAttributes,
        });

        if (_member) {
          if (
            !_member.roles.some(
              (_role) =>
                _role.name === "INACTIVE" &&
                !_member.roles.some((_role) => _role.name === "PURGED")
            )
          ) {
            next();
          } else {
            res
              .status(401)
              .send({ msg: "Your account has not been activated yet" });
          }
        }
      }
    } else {
      res.status(401).send({ msg: "Please log in first" });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.verifyIsAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      const _token = authorization.split(" ")[1];

      const _decodedPayload = await jwt.verify(_token, process.env.JWT_SECRET);

      if (_decodedPayload) {
        const { id } = _decodedPayload.data;

        const _member = await prisma.member.findUnique({
          where: { id },
          select: publicAttributes,
        });

        if (_member) {
          if (_member.roles.some((_role) => _role.name === "ADMIN")) {
            next();
          } else {
            res
              .status(401)
              .send({ msg: "You are not authorized to access this resource" });
          }
        }
      }
    } else {
      res.status(401).send({ msg: "Please log in first" });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.verifyValidToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      const _token = authorization.split(" ")[1];

      if (_token) {
        const _decodedPayload = await jwt.verify(
          _token,
          process.env.JWT_SECRET
        );

        if (_decodedPayload) {
          const { id } = _decodedPayload.data;
          const _member = await prisma.member.findUnique({
            where: { id },
            select: publicAttributes,
          });

          if (_member) {
            if (
              !_member.roles.some(
                (_role) =>
                  _role.name === "INACTIVE" &&
                  !_member.roles.some((_role) => _role.name === "PURGED")
              )
            ) {
              res.status(200).send({ _member });
            } else {
              res.status(401);
            }
          }
        }
      }
    } else {
      res.status(401);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.resetMemberPassword = async (req, res, next) => {
  try {
    const { emailAddress } = req.body;

    const _member = await prisma.member.findFirst({ where: { emailAddress } });

    if (_member) {
      // generate new password and send email

      const _newPassword = await generator.generate({
        length: 10,
        numbers: true,
        lowercase: true,
        uppercase: true,
        symbols: false,
      });

      const _hashedPassword = await bcrypt.hash(_newPassword, 12);

      const _updatedMember = await prisma.member.update({
        where: { id: _member.id },
        data: {
          password: _hashedPassword,
          firstLogin: true,
        },
      });

      await sendResetPasswordEmail(
        _member.firstName,
        _member.lastName,
        _member.emailAddress,
        _newPassword
      );

      return res.sendStatus(200);
    } else {
      res.sendStatus(200);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.updateMembersPassword = async (req, res, next) => {
  try {
    const { id, currentPassword, password } = req.body;

    const _member = await prisma.member.findUnique({ where: { id } });

    if (_member) {
      const _passwordVerified = await bcrypt.compare(
        currentPassword,
        _member.password
      );

      if (_passwordVerified) {
        const _updatedPassword = await bcrypt.hash(password, 12);

        const _updatedMember = await prisma.member.update({
          where: { id },
          data: {
            password: _updatedPassword,
            firstLogin: false,
          },
          select: { ...publicAttributes, password: true },
        });

        if (_updatedMember) {
          const _jwtPayload = {
            id: _member.id,
          };

          const _token = await jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) * (60 * 60),
              data: _jwtPayload,
            },
            process.env.JWT_SECRET
          );

          if (_token) {
            res.status(200).send({ _token, _member: _updatedMember });
          }
        }
      } else {
        return res.status(401).send({ err: "Current password is invalid" });
      }
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};
