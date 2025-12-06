// server/api/goals/[id]/transactions/index.get.ts
export default defineEventHandler(async (event) => {
    
  // รับค่า id จาก router param และข้อมูลผู้ใช้ปัจจุบัน
  const id = getRouterParam(event, 'id')

  // ใช้ requireUser เพื่อตรวจสอบสิทธิ์และดึงข้อมูลผู้ใช้ในคำสั่งเดียว
  const user = await requireUser(event)

  // ตรวจสอบว่ามี ID ส่งมาหรือไม่
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID' })
  }

  // แปลง ID เป็นตัวเลข
  const goalId = parseInt(id)

  // ค้นหาเป้าหมายจากฐานข้อมูล
  const goal = await prisma.goal.findUnique({
    where: { id: goalId }
  })

  // ตรวจสอบว่าพบเป้าหมายหรือไม่
  if (!goal) {
    throw createError({ statusCode: 404, statusMessage: 'Goal not found' })
  }

  // ตรวจสอบสิทธิ์ความเป็นเจ้าของ (เฉพาะเจ้าของเท่านั้นที่ดูรายการธุรกรรมได้)
  if (goal.ownerId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // ค้นหารายการธุรกรรมทั้งหมดของเป้าหมายนี้ เรียงตามวันที่ล่าสุด
  const transactions = await prisma.transaction.findMany({
    where: { goalId },
    orderBy: { createdAt: 'desc' }
  })

  // ส่งคืนข้อมูลรายการธุรกรรม
  return transactions
})