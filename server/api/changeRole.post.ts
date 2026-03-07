import { prisma } from '../utils/prisma'
import {defineEventHandler} from 'h3'

export default defineEventHandler(async (event) => {
  const { candidate, id } = await readBody(event)
  try {
    await prisma.user.update({
      where: {
        id: candidate,
      },
      data: {
        roles: {
          deleteMany: {},
          create: {
            roleId: id
          }
        }
      },
    })
  } catch (e) {
    console.error(e)
  }
})
