const { PrismaClient } = require("@prisma/client");
const { generatDefaultError } = require("../helpers/common");
const prisma = new PrismaClient();

exports.createAdvertisement = async (req, res, next) => {
  try {
    const { price, title, description, id } = req.body;
    const { fileId } = req;

    const _advertisment = await prisma.advertisement.create({
      data: {
        price,
        title,
        description,
        image: {
          connect: {
            id: fileId,
          },
        },
        member: {
          connect: {
            id,
          },
        },
      },
    });

    if (_advertisment) {
      res.status(200).send(_advertisment);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.updateAdvertisementVerificationStatus = async (req, res, next) => {
  try {
    const { id, verified } = req.body;

    if (verified) {
      const _advertisement = await prisma.advertisement.update({
        where: {
          id,
        },
        data: {
          verified,
        },
      });

      if (_advertisement) {
        res.status(200).send(_advertisement);
      }
    } else {
      const _advertisement = await prisma.advertisement.delete({
        where: {
          id,
        },
      });

      if (_advertisement) {
        res.status(200).send("Deleted");
      }
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.updateAdvertisementStatus = async (req, res, next) => {
  try {
    const { id, sold } = req.body;

    const _advertisment = await prisma.advertisement.update({
      where: { id },
      data: {
        sold,
      },
    });

    if (_advertisment) {
      res.status(200).send(_advertisment);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.deleteAdvertisement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const _advertisment = await prisma.advertisement.delete({
      where: { id },
    });

    if (_advertisment) {
      res.status(200).send(_advertisment);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};

exports.getAllAdvertisements = async (req, res, next) => {
  try {
    const { isVerified } = req.params;
    let booleanQuery = false;

    if (isVerified === "true") booleanQuery = true;

    const _advertisements = await prisma.advertisement.findMany({
      where: {
        verified: booleanQuery,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            mobileNumber: true,
          },
        },
        price: true,
        title: true,
        description: true,
        sold: true,
        image: true,
        id: true,
        verified: true,
      },
    });

    if (_advertisements) {
      res.status(200).send(_advertisements);
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};
