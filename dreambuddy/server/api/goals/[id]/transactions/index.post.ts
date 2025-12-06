// server/api/goals/[id]/transactions/index.post.ts
import { z } from 'zod'

// กำหนด Schema สำหรับตรวจสอบข้อมูลการทำธุรกรรม
const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['DEPOSIT', 'WITHDRAW']),
  note: z.string().optional()
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

  // ค้นหาเป้าหมายจากฐานข้อมูล
  const goal = await prisma.goal.findUnique({
    where: { id: goalId }
  })

  // ตรวจสอบว่าพบเป้าหมายหรือไม่
  if (!goal) {
    throw createError({ statusCode: 404, statusMessage: 'Goal not found' })
  }

  // ตรวจสอบสิทธิ์ความเป็นเจ้าของ (เฉพาะเจ้าของเท่านั้นที่ทำธุรกรรมได้)
  if (goal.ownerId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // อ่านข้อมูลจาก Body และตรวจสอบความถูกต้องด้วย Schema
  const body = await readBody(event)
  const result = createTransactionSchema.safeParse(body)

  // ถ้าข้อมูลไม่ถูกต้อง ให้ส่ง error กลับไป
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
      data: result.error.issues
    })
  }

  const { amount, type, note } = result.data

  // ใช้ Transaction เพื่อความถูกต้องของข้อมูล (สร้างรายการธุรกรรม + อัปเดตยอดเงินในเป้าหมาย)
  const [transaction, updatedGoal] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        goalId,
        userId: user.id,
        amount,
        type,
        note
      }
    }),
    prisma.goal.update({
      where: { id: goalId },
      data: {
        savedAmount: {
          increment: type === 'DEPOSIT' ? amount : -amount
        }
      }
    })
  ])

  // ส่งคืนข้อมูลรายการธุรกรรมที่สร้างเสร็จแล้ว
  return transaction
})