import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const statuses = [
    "Not started",
    "In process",
    "Completed",
    "Abandoned",
    "Frozen",
  ];

  await prisma.status.createMany({
    data: statuses.map((name) => ({name})),
    skipDuplicates: true,
  });

  const roles = ["USER", "ADMIN", "OWNER"];

  await prisma.role.createMany({
    data: roles.map((name) => ({name})),
    skipDuplicates: true,
  });

  console.log("Seed done ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
