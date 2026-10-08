import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const Garden = await prisma.garden.create({
    data: { Name: "Kebun Belakang Rumah", Location: "Jakarta" },
  });

  const Plant = await prisma.plant.create({
    data: { Name: "Tomat Cherry", Species: "Solanum lycopersicum", GardenId: Garden.Id, PlantedDate: new Date() },
  });

  const NextDueAt = new Date();
  NextDueAt.setDate(NextDueAt.getDate() + 3);

  await prisma.careSchedule.create({
    data: { PlantId: Plant.Id, Type: "WATERING", FrequencyDays: 3, NextDueAt },
  });
}

main().then(() => prisma.$disconnect()).catch(async (Error) => {
  console.error(Error);
  await prisma.$disconnect();
  process.exit(1);
});
