import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const statuses = [
    "notStarted",
    "inProcess",
    "completed",
    "abandoned",
    "frozen",
  ];

  await prisma.status.createMany({
    data: statuses.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const roles = ["user", "admin", "owner"];

  await prisma.role.createMany({
    data: roles.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const userRole = await prisma.role.findUnique({
    where: { name: "user" },
  });

  if (!userRole) {
    throw new Error("Role 'user' not found");
  }

  let user = await prisma.user.findFirst({
    where: { email: "test@example.com" },
    include: {
      roles: true,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "123456",
        name: "Test User",
        gender: "male",
        roles: {
          create: {
            roleId: userRole.id,
          },
        },
      },
      include: {
        roles: true,
      },
    });
  }

  const status = await prisma.status.findFirst({
    where: { name: "notStarted" },
  });

  if (!status) {
    throw new Error("Status 'notStarted' not found");
  }

  for (let i = 1; i <= 10; i++) {
    const project = await prisma.project.create({
      data: {
        title: `Проект ${i}`,
        description: `Описание проекта ${i}`,
        deadline: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000),
        statusId: status.id,
        handlerId: user.id,
      },
    });

    for (let j = 1; j <= 5; j++) {
      const task = await prisma.task.create({
        data: {
          title: `Задача ${j} проекта ${i}`,
          description: `Описание задачи ${j} для проекта ${i}`,
          deadline: new Date(Date.now() + (i + j) * 3 * 24 * 60 * 60 * 1000),
          statusId: status.id,
          handlerId: user.id,
          projectId: project.id,
        },
      });

      await prisma.userTask.create({
        data: {
          userId: user.id,
          taskId: task.id,
        },
      }).catch(() => {});
    }

    await prisma.adminProject.create({
      data: {
        userId: user.id,
        projectId: project.id,
      },
    }).catch(() => {});
  }

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
