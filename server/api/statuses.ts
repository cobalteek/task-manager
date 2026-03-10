import {prisma} from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event)
  try {
    return prisma.status.findMany({})
  } catch (e) {
    console.log(e)
    throw createError({
      statusCode: 402,
      statusMessage: t('error.status.get')
    })
  }
})
