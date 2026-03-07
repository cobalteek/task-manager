import { prisma } from '../utils/prisma'
import {defineEventHandler} from 'h3'

export default defineEventHandler(async (event: any) => {
  try {
    const users = await prisma.user.findMany({
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
    return users
  } catch (error) {
    console.log(error)
  }
})
