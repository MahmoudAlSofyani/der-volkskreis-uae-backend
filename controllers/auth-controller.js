const { PrismaClient } = require("@prisma/client");
const { generatDefaultError, generateError } = require("../helpers/common");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            res.status(200).send({ _member });
          } else {
            res.status(401);
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
