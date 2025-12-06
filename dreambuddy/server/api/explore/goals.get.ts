// server/api/explore/goals.get.ts
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const goals = await prisma.goal.findMany({
    where: {
      visibility: 'PUBLIC'
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50 // Limit to 50 for now
  })

  return goals
})