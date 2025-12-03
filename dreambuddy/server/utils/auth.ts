import { H3Event, getCookie, setCookie, deleteCookie } from 'h3'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const COOKIE_NAME = 'dreambuddy_token'

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env file')
}

export type JwtPayload = {
  userId: number
}

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(plain, salt)
  return hash
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: JWT_EXPIRES_IN
  } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload
  } catch {
    return null
  }
}

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7 // 7 วัน
  })
}

export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export async function getCurrentUser(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  })

  return user
}