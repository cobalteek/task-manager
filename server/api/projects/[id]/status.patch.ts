import { prisma } from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { userId } = requireUser(event)
  const body = await readBody<{ statusId: number }>(event)

  if (!body?.statusId) {
    throw createError({ statusCode: 400, statusMessage: "statusId is required" })
  }

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      createdById: true,
    },
  })

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found"
    })
  }

  if (project.createdById !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only the creator of the project can edit it"
    })
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
