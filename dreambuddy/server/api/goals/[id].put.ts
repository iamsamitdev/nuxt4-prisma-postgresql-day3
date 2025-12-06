// server/api/goals/[id].put.ts
import { z } from 'zod'

// กำหนด Schema สำหรับตรวจสอบข้อมูลการแก้ไขเป้าหมาย
const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
  targetAmount: z.number().positive().optional(),
  targetDate: z.string().or(z.date()).optional(),
  category: z.string().optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC', 'LINK_ONLY']).optional(),
  note: z.string().optional(),
  imageUrl: z.string().optional()
})

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

  // ตรวจสอบสิทธิ์ความเป็นเจ้าของ (เฉพาะเจ้าของเท่านั้นที่แก้ไขได้)
  if (existingGoal.ownerId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // อ่านข้อมูลจาก Body และตรวจสอบความถูกต้องด้วย Schema
  const body = await readBody(event)
  const result = updateGoalSchema.safeParse(body)

  // ถ้าข้อมูลไม่ถูกต้อง ให้ส่ง error กลับไป
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
      data: result.error.issues
    })
  }

  const { title, targetAmount, targetDate, category, visibility, note, imageUrl } = result.data

  // จัดการ shareSlug กรณีเปลี่ยนเป็น LINK_ONLY
  let shareSlug = existingGoal.shareSlug
  if (visibility === 'LINK_ONLY' && !shareSlug) {
    shareSlug = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
  }

  // อัปเดตข้อมูลเป้าหมายในฐานข้อมูล
  const updatedGoal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      title,
      targetAmount,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      category,
      visibility,
      note,
      imageUrl,
      shareSlug
    }
  })

  // ส่งคืนข้อมูลเป้าหมายที่อัปเดตแล้ว
  return updatedGoal
})