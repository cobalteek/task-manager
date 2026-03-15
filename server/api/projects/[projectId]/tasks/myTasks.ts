import {prisma} from '#server/utils/prisma'
import {requireUser} from "#server/utils/auth";

export default defineEventHandler(async (event) => {

  const {userId} = await requireUser(event)
  const {projectId} = getRouterParams(event)

  return prisma.task.findMany({
    where: {
      projectId: projectId,
      handlerId: userId
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
