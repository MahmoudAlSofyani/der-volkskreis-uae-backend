require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { generateError, generatDefaultError } = require("../helpers/common");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { membersValidator } = require("../validators/members-validator");
const { PrismaDelete } = require("@paljs/plugins");

const prisma = new PrismaClient();

exports.createPost = async (req, res, next) => {
  try {
    const { memberId, title, description } = req.body;

    const _post = await prisma.post.create({
      data: {
        title,
        description,
        member: {
          connect: {
            id: memberId,
          },
        },
      },
      select: {
        comments: true,
        title: true,
        id: true,
      },
    });

    if (_post) {
      res.status(200).send(_post);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getAllPost = async (req, res, next) => {
  try {
    const _post = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        title: true,
        id: true,
        member: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        comments: {
          select: {
            createdAt: true,
            comment: true,
            member: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },

        createdAt: true,
      },
    });

    if (_post) {
      res.status(200).send(_post);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const _post = await prisma.post.findUnique({
      where: { id },
      select: {
        title: true,
        id: true,
        description: true,
        member: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        comments: {
          select: {
            createdAt: true,
            comment: true,
            member: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    if (_post) {
      res.status(200).send(_post);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.searchPost = async (req, res, next) => {
  try {
    const { searchQuery } = req.body;

    const _post = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
            },
          },
          {
            description: {
              contains: searchQuery,
            },
          },
        ],
      },
      select: {
        title: true,
        id: true,
        member: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        comments: {
          select: {
            createdAt: true,
            comment: true,
            member: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    if (_post) {
      res.status(200).send(_post);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};
