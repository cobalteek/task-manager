import bcrypt from 'bcrypt'
import { prisma } from '../../utils/prisma'
import { signToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  const token = signToken({ userId: user.id })

  setCookie(event, 'token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { success: true }
})
