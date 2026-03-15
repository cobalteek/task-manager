import { prisma } from '../utils/prisma'
import {
  defineEventHandler,
  createError,
  getQuery
} from 'h3'

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event)
  const query = getQuery(event)
  const role = query.role ? String(query.role) : undefined

  try {
    return await prisma.user.findMany({
      ...(role && {
        where: {
          roles: {
            some: {
              role: {
                name: String(role)
              }
            }
          }
        }
      }),
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })
  } catch (error) {
    console.log(error)
    throw createError({
      statusCode: 404,
      statusMessage: t('error.user.get')
    })
  }
})
