import { prisma } from '~~/server/utils/prisma'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)

  try {
    console.log('USER:', user)
    console.log('BODY:', body)

    const existingUser = await prisma.user.findUnique({
      where: { id: user.userId }
    })

    if (!existingUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    const defaultStatus = await prisma.status.findFirst()

    if (!defaultStatus) {
      throw createError({
        statusCode: 500,
        statusMessage: 'No statuses found in database'
      })
    }

    return await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        deadline: body.deadline ? new Date(body.deadline) : null,
        statusId: defaultStatus.id,
        createdById: user.userId,
      },
      include: {
        status: true,
        createdBy: {
          select: { id: true, name: true }
        }
      }
    })
  } catch (error: any) {
    console.error('PROJECT CREATE ERROR FULL:', error)
    console.error('PROJECT CREATE ERROR MESSAGE:', error?.message)
    console.error('PROJECT CREATE ERROR CODE:', error?.code)
    console.error('PROJECT CREATE ERROR META:', error?.meta)

    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.message || error?.statusMessage || 'Project create failed'
    })
  }
})
