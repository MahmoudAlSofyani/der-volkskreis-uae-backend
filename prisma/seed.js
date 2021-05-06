const {
  carModels,
  carColors,
  plateEmirates,
  abuDhabiCodes,
  ajmanCodes,
  umAlQuwainCodes,
  rasAlKhaimahCodes,
  fujairahCodes,
  dubaiCodes,
  sharjahCodes,
} = require("../data/carData");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: "ADMIN",
    },
    {
      name: "ACTIVE",
    },
    {
      name: "INACTIVE",
    },
    {
      name: "WOLFSBURG",
    },
    {
      name: "PURGED"
    },
    {
      name: "REJECTED"
    }
  ];

  for (let role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  for (let carModel of carModels) {
    await prisma.carModel.create({
      data: carModel,
    });
  }
  for (let carColor of carColors) {
    await prisma.carColor.create({
      data: carColor,
    });
  }

  for (let plateEmirate of plateEmirates) {
    await prisma.plateEmirate.create({
      data: plateEmirate,
    });
  }

  const emirates = await prisma.plateEmirate.findMany({
    select: { id: true, name: true },
  });
  if (emirates) {
    emirates.forEach(async (_emirate) => {
      switch (_emirate.name) {
        case "Abu Dhabi": {
          await prisma.plateEmirate.update({
            where: { id: _emirate.id },
            data: {
              plateCodes: {
                create: abuDhabiCodes,
              },
            },
          });
          break;
        }
        case "Dubai": {
          await prisma.plateEmirate.update({
            where: { id: _emirate.id },
            data: {
              plateCodes: {
                create: dubaiCodes,
              },
            },
          });
          break;
        }
        case "Ajman": {
          await prisma.plateEmirate.update({
            where: { id: _emirate.id },
            data: {
              plateCodes: {
                create: ajmanCodes,
              },
            },
          });
          break;
        }
        case "Um Al Quwain": {
          await prisma.plateEmirate.update({
            where: { id: _emirate.id },
            data: {
              plateCodes: {
                create: umAlQuwainCodes,
              },
            },
          });
          break;
        }
        case "Ras Al Khaimah": {
          await prisma.plateEmirate.update({
            where: { id: _emirate.id },
            data: {
              plateCodes: {
                create: rasAlKhaimahCodes,
              },
            },
          });
          break;
        }
        case "Fujairah": {
          await prisma.plateEmirate.update({
            where: { id: _emirate.id },
            data: {
              plateCodes: {
                create: fujairahCodes,
              },
            },
          });
          break;
        }
        case "Sharjah": {
          await prisma.plateEmirate.update({
            where: { id: _emirate.id },
            data: {
              plateCodes: {
                create: sharjahCodes,
              },
            },
          });
          break;
        }
        default:
          return;
      }
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
