// server/api/goals/index.get.ts
export default defineEventHandler(async (event) => {
  // ใช้ requireUser เพื่อตรวจสอบสิทธิ์และดึงข้อมูลผู้ใช้ในคำสั่งเดียว
  const user = await requireUser(event)

  const goals = await prisma.goal.findMany({
    where: {
      ownerId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return goals
})