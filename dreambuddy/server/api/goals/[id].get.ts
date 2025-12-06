// server/api/goals/[id].get.ts
import { prisma } from '../../utils/prisma'
import { getCurrentUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // รับค่า id จาก router param และข้อมูลผู้ใช้ปัจจุบัน
  const id = getRouterParam(event, 'id')
  const user = await getCurrentUser(event)

  // ตรวจสอบว่ามี ID ส่งมาหรือไม่
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID' })
  }

  // ค้นหาเป้าหมายจากฐานข้อมูล พร้อมดึงข้อมูลเจ้าของ
  const goal = await prisma.goal.findUnique({
    where: { id: parseInt(id) },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true
        }
      }
    }
  })

  // ตรวจสอบว่าพบเป้าหมายหรือไม่
  if (!goal) {
    throw createError({ statusCode: 404, statusMessage: 'Goal not found' })
  }

  // ตรวจสอบสิทธิ์การเข้าถึง
  const isOwner = user?.id === goal.ownerId
  const isPublic = goal.visibility === 'PUBLIC'
  
  // ถ้าไม่ใช่เจ้าของ และไม่ใช่สาธารณะ ให้ปฏิเสธการเข้าถึง
  if (!isOwner && !isPublic) {
     throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // ส่งคืนข้อมูลเป้าหมาย
  return goal
})