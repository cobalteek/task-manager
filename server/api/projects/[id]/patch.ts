import {prisma} from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  const {id} = getRouterParams(event)
  const {userId} = requireUser(event)

  const body = await readBody<{
    title: string
    description: string
    deadline: string
  }>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: "Data not found"
    })
  }

  const project = await prisma.project.findUnique({
    where: {id},
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

  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {
      id: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    })
  }

  const isOwner = user.roles.some((r: { role: { name: string; }; }) => r.role.name === 'OWNER')

  if (project.createdById !== userId && !isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only the creator of the project or OWNER can delete it",
    })
  }

  try {
    return await prisma.project.update({
      where: {id},
      data: {
        title: body.title,
        description: body.description,
        deadline: body.deadline ? new Date(body.deadline) : null,
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
