require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { generateError, generatDefaultError } = require("../helpers/common");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { membersValidator } = require("../validators/members-validator");
const { PrismaDelete } = require("@paljs/plugins");

const prisma = new PrismaClient();

exports.addNewComment = async (req, res, next) => {
  try {
    const { memberId, postId, comment } = req.body;



    const _comment = await prisma.comment.create({
      data: {
        comment,
        post: {
          connect: {
            id: postId,
          },
        },
        member: {
          connect: {
            id: memberId,
          },
        },
      },
    });

    if (_comment) {
      res.status(200).send(_comment);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};
