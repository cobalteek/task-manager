import {prisma} from '../utils/prisma'
import {requireUser} from '.././utils/auth'

export default defineEventHandler(async (event) => {
  const {userId} = await requireUser(event)

  return prisma.task.findMany({where: {userId}})
})
