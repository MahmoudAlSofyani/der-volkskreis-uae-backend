const { PrismaClient } = require("@prisma/client");
const { generateError, generatDefaultError } = require("../helpers/common");
const prisma = new PrismaClient();

exports.addNewCarModel = async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log(name);

    const carModel = await prisma.carModel.create({
      data: { name },
    });

    if (carModel) {
      res.status(200).send({ msg: "Car model added successfully" });
    }
  } catch (err) {
    generatDefaultError(err, req, next);
  }
};
