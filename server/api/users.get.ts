import { prisma } from '../utils/prisma'
import {defineEventHandler} from 'h3'

export default defineEventHandler(async () => {
  try {
    return await prisma.user.findMany({
      where: {
        roles: {
          some: {role: {name: 'USER'}},
        },
      },
      select: {
        id: true,
        name: true,
      }
    })
  } catch (error) {
    console.log(error)
  }
})
