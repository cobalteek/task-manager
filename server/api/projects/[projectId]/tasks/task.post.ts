import {prisma} from '~~/server/utils/prisma'
import {requireUser} from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const {projectId} = getRouterParams(event)
  const body = await readBody(event)
  const t = await useTranslation(event)

  if (!body) {
    throw createError({
      statusCode: 404,
      statusMessage: t('error.data.notFound')
    })
  }

  try {

    const defaultStatus = await prisma.status.findFirst()

    if (!defaultStatus) {
      throw createError({
        statusCode: 500,
        statusMessage: t('error.status.notFound')
      })
    }

    return await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        deadline: body.deadline ? new Date(body.deadline) : null,
        status: {
          connect: {id: defaultStatus.id}
        },
        ...(body.handlerId && {
          handler: {
            connect: {id: body.handlerId}
          }
        }),
        project: {
          connect: {id: projectId}
        }
      },
      include: {
        status: true,
        handler: {
          select: {id: true, name: true}
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
      statusMessage: error?.message || error?.statusMessage || t('error.project.create')
    })
  }
})
