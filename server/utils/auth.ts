import jwt from 'jsonwebtoken'
import {getCookie, type H3Event} from 'h3'
import { createError } from 'h3'

export function signToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}


export function requireUser(event: H3Event) {
  const token = getCookie(event, 'token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = payload.userId
    if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    return { userId }

  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
