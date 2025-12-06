// server/api/goals/index.post.ts
import { z } from 'zod'

// กำหนด Schema สำหรับตรวจสอบข้อมูลการสร้างเป้าหมาย
const createGoalSchema = z.object({
  title: z.string().min(1),
  targetAmount: z.number().positive(),
  targetDate: z.string().or(z.date()),
  category: z.string().optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC', 'LINK_ONLY']).default('PRIVATE'),
  note: z.string().optional(),
  imageUrl: z.string().optional()
})

export default defineEventHandler(async (event) => {
  // ตรวจสอบสิทธิ์และดึงข้อมูลผู้ใช้ (ถ้าไม่ได้ login จะ error 401 อัตโนมัติ)
  const user = await requireUser(event)

  // อ่านข้อมูลจาก Body
  const body = await readBody(event)
  // ตรวจสอบความถูกต้องของข้อมูลด้วย Schema
  const result = createGoalSchema.safeParse(body)

  // ถ้าข้อมูลไม่ถูกต้อง ให้ส่ง error กลับไป
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
      data: result.error.issues
    })
  }

  const { title, targetAmount, targetDate, category, visibility, note, imageUrl } = result.data

  let shareSlug = null
  // ถ้ากำหนดการมองเห็นเป็น LINK_ONLY ให้สร้าง slug สำหรับแชร์
  if (visibility === 'LINK_ONLY') {
    // สร้าง slug แบบสุ่ม
    shareSlug = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
  }

  // บันทึกเป้าหมายลงฐานข้อมูล
  const goal = await prisma.goal.create({
    data: {
      title,
      targetAmount,
      targetDate: new Date(targetDate),
      category,
      visibility,
      note,
      imageUrl,
      shareSlug,
      ownerId: user.id
    }
  })

  // ส่งคืนข้อมูลเป้าหมายที่สร้างเสร็จแล้ว
  return goal
})