import {prisma} from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    return prisma.role.findMany({})
  } catch (e) {
    const t = await useTranslation(event)
    console.log(e)
    throw createError({
      statusCode: 402,
      statusMessage: t('error.role.get')
    })
  }
})
