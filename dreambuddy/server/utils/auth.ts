import { H3Event, getCookie, setCookie, deleteCookie } from 'h3'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// ค่าคงที่สำหรับ JWT และ Cookie
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const COOKIE_NAME = 'dreambuddy_token'

// ตรวจสอบว่ามีการตั้งค่า JWT_SECRET หรือไม่
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env file')
}

export type JwtPayload = {
  userId: number
}

// ฟังก์ชันสำหรับเข้ารหัสรหัสผ่าน
export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(plain, salt)
  return hash
}

// ฟังก์ชันสำหรับตรวจสอบรหัสผ่าน
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}

// สร้าง JWT Token
export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: JWT_EXPIRES_IN
  } as jwt.SignOptions)
}

// ตรวจสอบความถูกต้องของ JWT Token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload
  } catch {
    return null
  }
}

// ตั้งค่า Cookie สำหรับ Authentication
export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: false,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7 // 7 วัน
  })
}

// ลบ Cookie เมื่อออกจากระบบ
export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

// ดึงข้อมูลผู้ใช้ปัจจุบันจาก Context หรือ Cookie
export async function getCurrentUser(event: H3Event) {
  // 1. ลองดึงจาก Context (ที่ Middleware แปะไว้ให้)
  if (event.context.auth) {
    return await prisma.user.findUnique({
      where: { id: event.context.auth.userId }
    })
  }

  // 2. ถ้าไม่มีใน Context ให้ลองแกะจาก Cookie เอง (Fallback)
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  })

  return user
}

// ฟังก์ชันสำหรับบังคับให้ต้องมีผู้ใช้ที่ล็อกอิน
export async function requireUser(event: H3Event) {
  const user = await getCurrentUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user
}