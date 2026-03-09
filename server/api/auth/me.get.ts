import {prisma} from '../../utils/prisma'
import {requireUser} from '../../utils/auth'
import {createError} from 'h3'
import type {Prisma} from "@prisma/client";

export default defineEventHandler(async (event) => {
  const {userId} = requireUser(event)

  type UserWithRoles = Prisma.UserGetPayload<{
    include: { roles: { include: { role: true } } }
  }>

  const user = (await prisma.user.findUnique({
    where: {id: userId},
    include: {roles: {include: {role: true}}}
  })) as UserWithRoles | null

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const role = user.roles[0]?.role.name
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    role: role,
  }
})
