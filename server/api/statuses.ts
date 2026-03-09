import {prisma} from '../utils/prisma'

export default defineEventHandler(async () => {
  try {
    return prisma.status.findMany({})
  } catch (e) {
    console.log(e)
    throw createError({
      statusCode: 402,
      statusMessage: "Get statuses is failed"
    })
  }
})
