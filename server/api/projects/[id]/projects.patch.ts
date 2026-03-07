import { prisma } from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

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
