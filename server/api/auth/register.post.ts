import bcrypt from 'bcrypt'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { email, password, name, gender } = body

    if (!email || !password || !name || !gender) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields are required',
      })
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    })


    if (exists) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email already exists',
      })
    }

    const userRole = await prisma.role.findUnique({
      where: { name: 'USER' },
    })


    if (!userRole) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Role USER not found',
      })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name,
        gender,
        roles: {
          create: {
            roleId: userRole.id,
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })



    return {
      id: user.id,
      email: user.email,
      name: user.name,
      gender: user.gender,
      roles: user.roles.map((r: typeof user.roles[number]) => r.role.name),
    }
  } catch (error: any) {
    console.error('REGISTER ERROR FULL:', error)
    console.error('REGISTER ERROR MESSAGE:', error?.message)
    console.error('REGISTER ERROR CODE:', error?.code)
    console.error('REGISTER ERROR META:', error?.meta)

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Registration failed',
    })
  }
})
