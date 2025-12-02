import { PrismaClient } from '../app/generated/prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // -------------------------------
  // 1) สร้าง Users ตัวอย่าง 10 คน
  // -------------------------------
  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          username: `user${i + 1}`,
          email: `user${i + 1}@mail.com`,
          passwordHash: 'password123',
          bio: 'Just a sample user for DreamBuddy seeding.',
          avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=user${i + 1}`
        }
      })
    )
  )

  // -------------------------------
  // 2) สร้าง Goals ตัวอย่าง 10 รายการ
  // -------------------------------
  const sampleGoals = [
    'เที่ยวญี่ปุ่น',
    'ซื้อ iPad ใหม่',
    'เก็บเงินแต่งบ้าน',
    'ซื้อจักรยานไฟฟ้า',
    'ตั้งกองทุนสำรองเลี้ยงชีพ',
    'ไปเรียนคอร์สออนไลน์',
    'เก็บเงินแต่งงาน',
    'ซื้อ MacBook Pro',
    'เก็บเงินสำรองฉุกเฉิน',
    'ทริปภาคเหนือ'
  ]

  const goals = await Promise.all(
    sampleGoals.map((title, i) =>
      prisma.goal.create({
        data: {
          title,
          note: 'ตัวอย่างเป้าหมายเก็บเงิน',
          category: ['Travel', 'Gadget', 'Education', 'Life'][i % 4],
          imageUrl: null,
          targetAmount: 10000 + i * 5000,
          savedAmount: 0,
          targetDate: new Date(Date.now() + (i + 1) * 86400000 * 30),
          visibility: i % 3 === 0 ? 'PUBLIC' : 'PRIVATE',
          shareSlug: i % 3 === 2 ? randomUUID() : null,
          ownerId: users[i % 10].id
        }
      })
    )
  )

  // -------------------------------
  // 3) สร้าง Transactions ตัวอย่าง
  // -------------------------------
  await Promise.all(
    goals.map((goal) =>
      prisma.transaction.create({
        data: {
          amount: 500,
          type: 'DEPOSIT',
          note: 'เริ่มต้นออมงวดแรก',
          goalId: goal.id,
          userId: goal.ownerId
        }
      })
    )
  )

  // -------------------------------
  // 4) สร้าง Likes ตัวอย่าง (สุ่ม)
  // -------------------------------
  const likes = []
  for (let i = 0; i < goals.length; i++) {
    const goal = goals[i]
    const randomUser = users[i % users.length] // ใช้ modulo เพื่อไม่ให้ซ้ำกัน
    try {
      likes.push(
        prisma.goalLike.create({
          data: {
            goalId: goal.id,
            userId: randomUser.id
          }
        })
      )
    } catch (error) {
      // Skip if duplicate
    }
  }
  await Promise.all(likes)

  // -------------------------------
  // 5) สร้าง Comments ตัวอย่าง
  // -------------------------------
  const comments = [
    'สุดยอดเลยครับ!',
    'เป็นกำลังใจให้นะ',
    'ไปให้ถึงเป้าหมายครับ',
    'ขอให้สำเร็จเร็ว ๆ ครับ!',
    'ติดตามอยู่ครับ',
    'เยี่ยมมาก',
    'ไอเดียดีมากครับ',
    'ผมก็อยากทำแบบนี้',
    'สุดยอดจริง ๆ',
    'ขอแชร์ไอเดียนี้นะครับ'
  ]

  await Promise.all(
    goals.map((goal, i) =>
      prisma.goalComment.create({
        data: {
          goalId: goal.id,
          userId: users[i % users.length].id,
          content: comments[i]
        }
      })
    )
  )

  console.log('🌱 Seeding completed!')
}

// เรียกใช้งาน seed
main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })