// server/api/goals/[id].delete.ts
export default defineEventHandler(async (event) => {
  // รับค่า id จาก router param
  const id = getRouterParam(event, 'id')
  // ตรวจสอบสิทธิ์และดึงข้อมูลผู้ใช้ (ถ้าไม่ได้ login จะ error 401 อัตโนมัติ)
  const user = await requireUser(event)

  // ตรวจสอบว่ามี ID ส่งมาหรือไม่
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID' })
  }

  // แปลง ID เป็นตัวเลข
  const goalId = parseInt(id)

  // ค้นหาเป้าหมายเดิมจากฐานข้อมูล
  const existingGoal = await prisma.goal.findUnique({
    where: { id: goalId }
  })

  // ตรวจสอบว่าพบเป้าหมายหรือไม่
  if (!existingGoal) {
    throw createError({ statusCode: 404, statusMessage: 'Goal not found' })
  }

  // ตรวจสอบสิทธิ์ความเป็นเจ้าของ (เฉพาะเจ้าของเท่านั้นที่ลบได้)
  if (existingGoal.ownerId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // ลบเป้าหมายออกจากฐานข้อมูล
  await prisma.goal.delete({
    where: { id: goalId }
  })

  // ส่งคืนสถานะสำเร็จ
  return { success: true }
})