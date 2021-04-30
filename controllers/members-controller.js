require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { generateError, generatDefaultError } = require("../helpers/common");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { membersValidator } = require("../validators/members-validator");
const { PrismaDelete } = require("@paljs/plugins");

const prisma = new PrismaClient();

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
};

exports.addNewMember = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      whatsAppNumber,
      emailAddress,
      password,
      cars,
    } = req.body;

    const _existingMember = await prisma.member.findFirst({
      where: { emailAddress },
    });
    if (_existingMember) {
      return res
        .status(400)
        .send({ error: "User already exists. Please try logging in" });
    }

    const _hashedPassword = await bcrypt.hash(password, 12);
    const _newMember = await prisma.member.create({
      data: {
        firstName,
        lastName,
        mobileNumber,
        emailAddress,
        whatsAppNumber,
        password: _hashedPassword,
        cars: {
          create: cars,
        },
        roles: {
          create: {
            name: "INACTIVE",
          },
        },
      },
    });

    // TODO: Send email notification that new member has signed up

    if (_newMember) {
      return res.status(200).send({ message: "Account created successfully!" });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getAllMembers = async (req, res, next) => {
  try {
    const member = await prisma.member.findMany({
      select: publicAttributes,
    });
    if (member) {
      res.status(200).send(member);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.searchMember = async (req, res, next) => {
  try {
    const { searchQuery } = req.body;

    console.log(searchQuery);

    const member = await prisma.member.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: searchQuery,
            },
          },
          {
            lastName: {
              contains: searchQuery,
            },
          },
          {
            emailAddress: {
              contains: searchQuery,
            },
          },
          {
            mobileNumber: {
              contains: searchQuery,
            },
          },
          {
            whatsAppNumber: {
              contains: searchQuery,
            },
          },
          {
            cars: {
              some: {
                OR: [
                  {
                    carModel: {
                      contains: searchQuery,
                    },
                  },
                  {
                    carColor: {
                      contains: searchQuery,
                    },
                  },
                  {
                    carYear: {
                      contains: searchQuery,
                    },
                  },
                  {
                    plateEmirate: {
                      contains: searchQuery,
                    },
                  },
                  {
                    plateCode: {
                      contains: searchQuery,
                    },
                  },
                  {
                    plateNumber: {
                      contains: searchQuery,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      select: publicAttributes,
    });

    if (member && member.length > 0) {
      res.status(200).send(member);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const prismaDelete = new PrismaDelete(prisma);
    const { memberId } = req.body;

    const member = await prismaDelete.onDelete({
      model: "Member",
      where: { id: memberId },
      deleteParent: true,
    });

    if (member) {
      res.status(200).send({ msg: "Member deleted successfully" });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.updateMemberRoles = async (req, res, next) => {
  try {
    const { roles, id } = req.body;

    const member = await prisma.member.findFirst({ where: { id } });

    if (member) {
      const _updatedMember = await prisma.member.update({
        where: { id },
        data: {
          roles: {
            create: roles.create,
            delete: roles.delete,
          },
        },
      });

      if (_updatedMember) {
        return res.status(200).send("Member updated");
      }
    } else {
      return res.status(400).send("Member not found");
    }
  } catch (err) {
    // console.log(err);
    generatDefaultError(err, req, next);
  }
};
