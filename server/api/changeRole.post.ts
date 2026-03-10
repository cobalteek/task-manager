import {prisma} from '../utils/prisma'
import {defineEventHandler} from 'h3'
import {requireUser} from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  const {candidate, roleId} = await readBody(event)
  const {userId} = await requireUser(event)
  const t = await useTranslation(event)

  if (!candidate) {
    throw createError({
      statusCode: 404,
      statusMessage: t('error.data.notFound')
    })
  }

  if (!roleId) {
    throw createError({
      statusCode: 404,
      statusMessage: t('error.role.idNotFound')
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
      statusMessage: t('error.user.notFound')
    })
  }

  const isOwner = user.roles.some((r: { role: { name: string } }) => r.role.name === 'OWNER')

  if (!isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: t('error.user.onlyCreator')
    })
  } else if (candidate === userId) {
    throw createError({
      statusCode: 403,
      statusMessage: t('error.user.creatorForever')
    })
  }

  try {
    await prisma.user.update({
      where: {
        id: candidate,
      },
      data: {
        roles: {
          deleteMany: {},
          create: {
            roleId: roleId
          }
        }
      },
    })

  } catch (e) {
    console.error(e)
    throw createError({
      statusCode: 401,
      statusMessage: t('error.role.change')
    })
  }
})
