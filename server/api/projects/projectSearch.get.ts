import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {

  const { q } = getQuery(event)

  return prisma.project.findMany({
    ...(q && {
      where: {
        OR: [
          { title: { contains: String(q), mode: "insensitive" } },
          { description: { contains: String(q), mode: "insensitive" } },
          {
            createdBy: {
              name: { contains: String(q), mode: "insensitive" }
            }
          }
        ]
      }
    }),

    orderBy: { title: 'asc' },

    include: {
      status: true,
      createdBy: {
        select: { id: true, name: true },
      },
    },
  })
})
