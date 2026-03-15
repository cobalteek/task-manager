import {prisma} from "#server/utils/prisma"
import type {Task} from "~~/types/task";

export default defineEventHandler(async (event) => {
  const { projectId, taskId } = getRouterParams(event)
  const {userId} = await requireUser(event)
  const body = await readBody<{task: Task, statusId: number }>(event)
  const t = await useTranslation(event)

  if (!body?.statusId) {
    throw createError({statusCode: 400, statusMessage: t('error.status.statusId')})
  }

  const project = await prisma.project.findUnique({
    where: {id: projectId},
    select: {
      id: true,
      handlerId: true,
    },
  })

  project.createdById

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: t('error.project.notFound')
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
    body.task.handler.id !== userId &&
    !isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: t('error.user.hasAccess')
    })
  }

  return await prisma.task.update({
    where: {projectId: projectId, id: taskId},
    data: {statusId: Number(body.statusId)},
    include: {
      status: true,
      handler: {select: {id: true, name: true}},
    },
  })
})
