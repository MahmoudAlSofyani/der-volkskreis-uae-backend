require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { generateError, generatError } = require("../helpers/common");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

exports.addNewUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      emailAddress,
      password,
      cars,
    } = req.body;

    const user = await prisma.user.findFirst({ where: { emailAddress } });
    if (user) {
      generateError(next, "User already exists", 404);
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      if (hashedPassword) {
        const _newUser = await prisma.user.create({
          data: {
            firstName,
            lastName,
            mobileNumber,
            emailAddress,
            password: hashedPassword,
            authenticationToken: "",
            cars: {
              create: cars,
            },
          },
        });

        if (_newUser) {
          const token = await jwt.sign(_newUser.id, process.env.JWT_SECRET);
          if (token) {
            const _updatedUser = await prisma.user.update({
              where: { id: _newUser.id },
              data: { authenticationToken: token },
            });
            if (_updatedUser) {
              res.status(200).send(_updatedUser);
            } else {
              generateError(next);
            }
          }
        } else {
          generateError(next);
        }
      } else {
        generateError(next);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany({ include: { cars: true } });
    if (user) {
      res.status(200).send(user);
    } else {
      generateError(next, "Users not found", 404);
    }
  } catch (err) {
    generateError(next, err.message, 500);
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user) {
      res.status(200).send(user);
    } else {
      generateError(next, "User not found", 404);
    }
  } catch (err) {
    generateError(next, err.message, 500);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.delete({ where: { id: userId } });

    if (user) {
      res.status(200).send(user);
    } else {
      generateError(next, "Failed to delete user", 500);
    }
  } catch (err) {
    generateError(next, err.message, 500);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userId, emailAddress, mobileNumber } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailAddress, mobileNumber },
    });

    if (user) {
      res.status(200).send(user);
    } else {
      generateError(next, "Failed to update user", 500);
    }
  } catch (err) {
    generateError(next, err.message, 500);
  }
};
