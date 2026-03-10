import {prisma} from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  const {id} = getRouterParams(event)
  const {userId} = await requireUser(event)
  const body = await readBody<{ statusId: number }>(event)
  const t = await useTranslation(event)

  if (!body?.statusId) {
    throw createError({statusCode: 400, statusMessage: t('error.status.statusId')})
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
      statusMessage: t('error.project.notFound')
    })
  }

  if (project.createdById !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: t('error.user.onlyCreator')
    })
  }

  return await prisma.project.update({
    where: {id},
    data: {statusId: Number(body.statusId)},
    include: {
      status: true,
      createdBy: {select: {id: true, name: true}},
    },
  })
})
