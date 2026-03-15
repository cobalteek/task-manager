import {prisma} from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const {projectId} = getRouterParams(event)

  return prisma.task.findMany({
      where: {
        projectId: projectId
      },
    orderBy: {title: 'asc'},
    include: {
      status: true,
      handler: {
        select: {id: true, name: true},
      },
    },
  })
})
