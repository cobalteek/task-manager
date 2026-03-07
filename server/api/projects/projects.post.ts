import { prisma } from '~~/server/utils/prisma'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  try {
    return await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        deadline: body.deadline ? new Date(body.deadline) : null,
        statusId: 1,
        createdById: user.userId,
      },
      include: {
        status: true,
        createdBy: {
          select: { id: true, name: true }
        }
      }
    })
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 405,
      statusMessage: "No created.."
    })
  }

})
