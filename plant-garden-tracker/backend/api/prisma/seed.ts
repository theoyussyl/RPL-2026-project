import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const Garden = await prisma.garden.create({
    data: { Name: "Kebun Belakang Rumah", Location: "Jakarta" },
  });

  const PlantsData = [
    { Name: "Tomat Cherry", Species: "Solanum lycopersicum" },
    { Name: "Cabai Rawit", Species: "Capsicum frutescens" },
    { Name: "Monstera", Species: "Monstera deliciosa" },
  ];

  for (const Data of PlantsData) {
    const Plant = await prisma.plant.create({
      data: { ...Data, GardenId: Garden.Id, PlantedDate: new Date() },
    });

    const NextDueAt = new Date();
    NextDueAt.setDate(NextDueAt.getDate() + 3);

    await prisma.careSchedule.create({
      data: { PlantId: Plant.Id, Type: "WATERING", FrequencyDays: 3, NextDueAt },
    });

    await prisma.growthLog.create({
      data: {
        PlantId: Plant.Id,
        PhotoUrl: "/uploads/placeholder.jpg",
        Note: "Kondisi awal tanaman",
        Condition: "HEALTHY",
      },
    });
  }

  console.log("Seed selesai");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (Error) => {
    console.error(Error);
    await prisma.$disconnect();
    process.exit(1);
  });
