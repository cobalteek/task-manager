import {prisma} from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const {id} = getRouterParams(event)
  const {userId} = requireUser(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project id is required'
    })
  }

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User id is required"
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

  const isOwner = user.roles.some((r: { role: { name: string } }) => r.role.name === 'OWNER')

  if (project.createdById !== userId && !isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only the creator of the project or OWNER can delete it",
    })
  }


  try {
    return await prisma.project.delete({
      where: {id},
      include: {
        status: true,
        createdBy: {
          select: {id: true, name: true}
        }
      }
    })

  } catch (error: any) {
    console.error('DELETE PROJECT ERROR:', error)

    throw createError({
      statusCode: 400,
      statusMessage: error?.message || 'Unable to delete'
    })
  }
})
