import {prisma} from '~~/server/utils/prisma'
import {requireUser} from "#imports";

export default defineEventHandler(async (event) => {

  const {userId} = await requireUser(event)

  return prisma.project.findMany({
    where: {
      OR: [
        {
          createdBy: {
            id: {contains: userId, mode: "insensitive"}
          }
        }
      ]
    },

    orderBy: {title: 'asc'},

    include: {
      status: true,
      createdBy: {
        select: {id: true, name: true},
      },
    },
  })
})
