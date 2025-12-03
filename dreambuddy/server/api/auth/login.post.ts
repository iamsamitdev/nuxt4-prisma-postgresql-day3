import { prisma } from "../../utils/prisma"
import { verifyPassword, signToken, setAuthCookie } from "../../utils/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: parsed.error.issues,
    })
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.passwordHash) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    })
  }

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    })
  }

  const token = signToken({ userId: user.id })
  setAuthCookie(event, token)

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