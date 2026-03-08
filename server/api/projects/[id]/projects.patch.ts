import { prisma } from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { userId } = requireUser(event)

  const body = await readBody<{
    title: string
    description: string
    deadline?: string | null
    statusId: number
  }>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: "Data not found"
    })
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

  try {
    return await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        deadline: body.deadline ? new Date(body.deadline) : null,
        statusId: Number(body.statusId),
      },
      include: {
        status: true,
        createdBy: {
          select: { id: true, name: true }
        },
      }
    })
  } catch (e) {
    console.error("PATCH PROJECT ERROR:", e)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update project"
    })
  }
})
