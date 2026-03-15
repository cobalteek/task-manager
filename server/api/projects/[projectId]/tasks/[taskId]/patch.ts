import {prisma} from "#server/utils/prisma"

export default defineEventHandler(async (event) => {
  const {projectId, taskId} = getRouterParams(event)
  const {userId} = await requireUser(event)
  const t = await useTranslation(event)

  const body = await readBody<{
    title: string
    description: string
    deadline: string
    handlerId: string
  }>(event)
  console.log('BODY', body)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: t('error.data.notFound')
    })
  }

  const project = await prisma.project.findUnique({
    where: {id: projectId},
    select: {
      id: true,
      handlerId: true,
    },
  })

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: t('error.project.notFound')
    })
  }

  const task = await prisma.task.findUnique({
    where: {id: taskId},
    select: {
      id: true,
      handlerId: true,
    }
  })

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: t('error.task.notFound')
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
      statusMessage: t('error.user.notFound'),
    })
  }

  const isOwner = user.roles.some((r: { role: { name: string; }; }) => r.role.name === 'owner')

  if (project.handlerId !== userId &&
    task.handlerId !== userId &&
    !isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: t('error.user.hasAccess'),
    })
  }

  try {
    console.log('BODY', body, projectId, taskId)
    return await prisma.task.update({
      where: {projectId: projectId, id: taskId},
      data: {
        title: body.title,
        description: body.description,
        deadline: body.deadline ? new Date(body.deadline) : null,
        handler: {
          connect: {id: body.handlerId}
        },
      },
      include: {
        handler: true
      }
    })
  } catch (e) {
    console.error("PATCH TASK ERROR:", e)
    throw createError({
      statusCode: 500,
      statusMessage: t('error.task.update')
    })
  }
})
