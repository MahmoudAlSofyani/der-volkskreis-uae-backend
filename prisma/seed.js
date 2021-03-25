const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { carModels } = require("../data/carData");

const main = async () => {
  const _carModels = await prisma.carModel.createMany({
    data: carModels,
    skipDuplicates: true,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
