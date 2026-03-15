import {prisma} from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const {projectId} = getRouterParams(event)
  const t = await useTranslation(event)
  const {userId} = await requireUser(event)

  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: t('error.project.idRequired')
    })
  }

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: t('error.user.idRequired')
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

  const isOwner = user.roles.some((r: { role: { name: string } }) => r.role.name === 'owner')

  if (project.handlerId !== userId && !isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: t('error.user.onlyCreator'),
    })
  }


  try {
    return await prisma.project.delete({
      where: {id: projectId},
      include: {
        status: true,
        handler: {
          select: {id: true, name: true}
        }
      }
    })

  } catch (error: any) {
    console.error('DELETE PROJECT ERROR:', error)

    throw createError({
      statusCode: 400,
      statusMessage: error?.message || t('error.project.delete')
    })
  }
})
