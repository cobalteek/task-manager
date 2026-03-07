import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project id is required'
    })
  }

  try {
    const deletedProject = await prisma.project.delete({
      where: { id },
      include: {
        status: true,
        createdBy: {
          select: { id: true, name: true }
        }
      }
    })

    return deletedProject
  } catch (error: any) {
    console.error('DELETE PROJECT ERROR:', error)

    throw createError({
      statusCode: 400,
      statusMessage: error?.message || 'Unable to delete'
    })
  }
})
