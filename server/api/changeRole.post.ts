import { prisma } from '../utils/prisma'
import {defineEventHandler} from 'h3'

export default defineEventHandler(async (event) => {
  const { candidate, roleId } = await readBody(event)

  if(!candidate) {
    throw createError({
      statusCode: 404,
      statusMessage: "Candidate not found"
    })
  }

  if(!roleId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Role ID not found"
    })
  }

  try {
    await prisma.user.update({
      where: {
        id: candidate,
      },
      data: {
        roles: {
          deleteMany: {},
          create: {
            roleId: roleId
          }
        }
      },
    })

  } catch (e) {
    console.error(e)
    throw createError({
      statusCode: 401,
      statusMessage: "Change role if failed"
    })
  }
})
