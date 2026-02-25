import bcrypt from 'bcrypt'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const { email, password, name } = await readBody(event)

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Email already exists' })

  const hash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hash, name: name ?? null },
    select: { id: true, email: true, name: true },
  })

  return user
})
