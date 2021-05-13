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
  browniePoints: true,
  events: true,
  profilePicture: true,
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
      carModel,
      carColor,
      carYear,
      plateEmirate,
      plateCode,
      plateNumber,
      vinNumber,
    } = req.body;

    let cars = {
      carModel,
      carColor,
      carYear,
      plateEmirate,
      plateCode,
      plateNumber,
      vinNumber,
    };

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
          connect: {
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
    const { roleType, id } = req.body;

    const _roleType = roleType.toLowerCase();

    let _queryArgs = [];

    switch (_roleType) {
      case "admin": {
        _queryArgs["connect"] = [{ name: "ADMIN" }];
        break;
      }
      case "verify": {
        _queryArgs["connect"] = [{ name: "ACTIVE" }];
        _queryArgs["delete"] = [{ name: "INACTIVE" }];
        break;
      }
      case "purged": {
        _queryArgs["connect"] = [{ name: "PURGED" }];
        _queryArgs["delete"] = [{ name: "ACTIVE" }];
        break;
      }
      case "unpurge": {
        _queryArgs["connect"] = [{ name: "ACTIVE" }];
        _queryArgs["delete"] = [{ name: "PURGED" }];
        break;
      }
      case "reject": {
        _queryArgs["connect"] = [{ name: "REJECTED" }];
        _queryArgs["delete"] = [{ name: "INACTIVE" }];
        break;
      }
      default: {
        _queryArgs = [];
      }
    }

    const _member = await prisma.member.update({
      where: { id },
      data: {
        roles: {
          connect: _queryArgs.connect,
          disconnect: _queryArgs.delete,
        },
      },
    });

    if (_member) {
      res.status(200).send({ msg: "Member roles updated!" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const _member = await prisma.member.findUnique({
      where: { id },
      select: publicAttributes,
    });
    if (_member) {
      res.status(200).send(_member);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getMemberStatusById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const _member = await prisma.member.findUnique({
      where: { id },
      select: publicAttributes,
    });

    if (_member) {
      let _isActive = true;
      if (
        !_member.roles.some(
          (_role) =>
            _role.name === "INACTIVE" &&
            !_member.roles.some((_role) => _role.name === "PURGED")
        )
      ) {
        _isActive = true;
      } else {
        _isActive = false;
      }
      res.status(200).send({ _isActive });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getMemberRoleById = async (req, res, next) => {
  try {
    const { id, role } = req.body;

    const _member = await prisma.member.findUnique({
      where: { id },
      select: publicAttributes,
    });

    if (_member) {
      let _isRoleExist = false;
      if (_member.roles.some((_role) => _role.name === role.toUpperCase())) {
        _isRoleExist = true;
      } else {
        _isRoleExist = false;
      }

      res.status(200).send({ _isRoleExist });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getMemberBrowniePointsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const _member = await prisma.member.findUnique({
      where: { id },
      select: publicAttributes,
    });

    if (_member) {
      res.status(200).send({ _browniePoints: _member.browniePoints });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.updateMember = async (req, res, next) => {
  try {
    const { id, mobileNumber, whatsAppNumber, emailAddress, instagramName } =
      req.body;

    const _member = await prisma.member.update({
      where: { id },
      data: {
        mobileNumber,
        whatsAppNumber,
        emailAddress,
        instagramName,
      },
    });

    if (_member) {
      res.status(200).send(_member);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.updateMemberProfilePicture = async (req, res, next) => {
  try {
    const { id } = req.body;
    const { fileId } = req;

    const _member = await prisma.member.update({
      where: { id },
      data: {
        profilePicture: {
          connect: {
            id: fileId,
          },
        },
      },
      select: publicAttributes,
    });

    if (_member) {
      res.status(200).send(_member);
    }
  } catch (err) {
    console.log(err);
  }
};
