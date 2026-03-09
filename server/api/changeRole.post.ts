import {prisma} from '../utils/prisma'
import {defineEventHandler} from 'h3'
import {requireUser} from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  const {candidate, roleId} = await readBody(event)
  const {userId} = requireUser(event)

  if (!candidate) {
    throw createError({
      statusCode: 404,
      statusMessage: "Candidate not found"
    })
  }

  if (!roleId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Role ID not found"
    })
  }

  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {
      id: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    })
  }

  const isOwner = user.roles.some((r: { role: { name: string } }) => r.role.name === 'OWNER')

  if (!isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only owner can change role!",
    })
  } else if (candidate === userId) {
    throw createError({
      statusCode: 403,
      statusMessage: "You can't change your role!",
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
