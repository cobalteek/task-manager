import {prisma} from '../utils/prisma'
import {defineEventHandler} from 'h3'

export default defineEventHandler(async () => {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      }
    })
  } catch (error) {
    console.log(error)
    throw createError({
      statusCode: 404,
      statusMessage: "Users with role 'USER' not found"
    })
  }
})
