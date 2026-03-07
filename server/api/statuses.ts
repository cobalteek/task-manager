import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    return prisma.status.findMany({})
  } catch (e) {
    console.log(e)
  }
})
