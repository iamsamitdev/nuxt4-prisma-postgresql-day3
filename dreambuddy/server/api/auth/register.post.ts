import { prisma } from "../../utils/prisma"
import { hashPassword, signToken, setAuthCookie } from "../../utils/auth"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: parsed.error.issues,
    })
  }

  // Destructure validated data
  const { name, username, email, password } = parsed.data

  // ค้นหาผู้ใช้ที่มี email หรือ username เดียวกัน
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  })

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "Email or username already taken",
    })
  }

  // แฮชรหัสผ่าน
  const passwordHash = await hashPassword(password)

  // สร้างผู้ใช้ใหม่ในฐานข้อมูล
  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      passwordHash,
    },
  })

  // สร้างโทเค็นและตั้งคุกกี้การตรวจสอบสิทธิ์
  const token = signToken({ userId: user.id })
  setAuthCookie(event, token)

  // อย่าส่ง passwordHash กลับไป
  return {
    token: token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    },
  }
})