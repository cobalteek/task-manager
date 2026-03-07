import { prisma } from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const body = await readBody<{ statusId: number }>(event)

  if (!body?.statusId) {
    throw createError({ statusCode: 400, statusMessage: "statusId is required" })
  }

  return await prisma.project.update({
    where: { id },
    data: { statusId: Number(body.statusId) },
    include: {
      status: true,
      createdBy: { select: { id: true, name: true } },
    },
  })
})
