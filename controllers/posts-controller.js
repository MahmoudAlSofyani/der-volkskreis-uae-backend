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
    const { categoryName, memberId, title } = req.body;

    const _post = await prisma.post.create({
      data: {
        category: {
          create: {
            name: categoryName,
          },
        },
        title,
        member: {
          connect: {
            id: memberId,
          },
        },
      },
      select: {
        category: true,
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
    const _posts = await prisma.post.findMany({
      select: {
        title: true,
        member: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            name: true,
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

    if (_posts) {
      res.status(200).send(_posts);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};
