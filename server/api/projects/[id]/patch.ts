import {prisma} from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  const {id} = getRouterParams(event)
  const {userId} = await requireUser(event)
  const t = await useTranslation(event)

  const body = await readBody<{
    title: string
    description: string
    deadline: string
  }>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: t('error.data.notFound')
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

  if (project.createdById !== userId && !isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: t('error.user.onlyCreator')
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
      statusMessage: t('error.project.update')
    })
  }
})
