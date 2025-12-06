## Full Stack Nuxt 4 with Prisma and PostgreSQL - Day 4

## 📋 สารบัญ
1. [Rest API Enhancements , explore , goals, transactions](#1-rest-api-enhancements--explore--goals-transactions)
2. [Frontend Enhancements](#2-frontend-enhancements)
3. [Build & Deploy](#3-build--deploy)

> ทำการ commit และ checkout new branch
  git add .
  git commit -m "Added authentication middleware for route protection"
  git checkout -b dev-user-dreambuddy

##### Remove middleware from `index.vue`
```vue
<script setup lang="ts">
-definePageMeta({
-  middleware: 'auth' // ใช้ middleware auth ที่สร้างขึ้น
-})
</script>
```

##### Edit  `server/utils/auth.ts`
```ts
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
```

## 1: Rest API Enhancements , explore , goals, transactions

### 1.1: Explore API routes
```
dreambuddy/
├─ server/
│  ├─ api/
│  │  ├─ explore/
│  │  │  ├─ goals.get.ts
```
### 1.2: Explore Goals API route
```ts
// server/api/explore/goals.get.ts
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const goals = await prisma.goal.findMany({
    where: {
      visibility: 'PUBLIC'
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50 // Limit to 50 for now
  })

  return goals
})
```

### 1.3: Goals API routes
```
dreambuddy/
├─ server/
│  ├─ api/
│  │  ├─ goals/
│  │  │  ├─ [id]/
│  │  │  │  ├─ transactions/
│  │  │  │  │  ├─ index.get.ts
│  │  │  │  │  ├─ index.post.ts
│  │  │  ├─ index.get.ts
│  │  │  ├─ index.post.ts
│  │  │  ├─ [id].get.ts
│  │  │  ├─ [id].put.ts
│  │  │  ├─ [id].delete.ts
```

##### 1.3.1: Get Goals API route
```ts
// server/api/goals/index.get.ts
export default defineEventHandler(async (event) => {
  // ใช้ requireUser เพื่อตรวจสอบสิทธิ์และดึงข้อมูลผู้ใช้ในคำสั่งเดียว
  const user = await requireUser(event)

  const goals = await prisma.goal.findMany({
    where: {
      ownerId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return goals
})
```

##### 1.3.2: Create Goal API route
```ts
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
```

##### 1.3.3: Get Goal by ID API route
```ts
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
```

##### 1.3.4: Update Goal by ID API route
```ts
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
```

##### 1.3.5: Delete Goal by ID API route
```ts
// server/api/goals/[id].delete.ts
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

  // ตรวจสอบสิทธิ์ความเป็นเจ้าของ (เฉพาะเจ้าของเท่านั้นที่ลบได้)
  if (existingGoal.ownerId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // ลบเป้าหมายออกจากฐานข้อมูล
  await prisma.goal.delete({
    where: { id: goalId }
  })

  // ส่งคืนสถานะสำเร็จ
  return { success: true }
})
```

### 1.4: Transactions API routes
```
dreambuddy/
├─ server/
│  ├─ api/
│  │  ├─ goals/
│  │  │  ├─ [id]/
│  │  │  │  ├─ transactions/
│  │  │  │  │  ├─ index.get.ts
│  │  │  │  │  ├─ index.post.ts
```

##### 1.4.1: Get Transactions for a Goal
```ts
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
```

##### 1.4.2: Create Transaction for a Goal
```ts
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
```

### 1.5 ใช้ Postman หรือ Insomnia ทดสอบ API
- ทดสอบ Explore Goals API: GET `/api/explore/goals`
- ทดสอบ Goals API (CRUD):
    - สร้าง Goal (POST `/api/goals`)
        - ตัวอย่าง Body:
        ```json
        {
            "title": "เที่ยวเกาหลี",
            "targetAmount": 60000,
            "targetDate": "2026-12-31",
            "category": "Travel",
            "visibility": "PUBLIC",
            "note": "อยากไปเที่ยวช่วงปีใหม่",
            "imageUrl": "https://example.com/korea.jpg"
        }
        ```
    - ดึง Goals ของผู้ใช้ (GET `/api/goals`)
    - ดึง Goal โดย ID (GET `/api/goals/{id}`)
    - แก้ไข Goal โดย ID (PUT `/api/goals/{id}`)
    - ตัวอย่าง Body:
        ```json
        {
          "title": "เที่ยวจีน",
          "targetAmount": 80000,
          "targetDate": "2027-06-30",
          "category": "Travel",
          "visibility": "LINK_ONLY",
          "note": "เปลี่ยนใจอยากไปเที่ยวจีนแทน",
          "imageUrl": "https://example.com/china.jpg"
        }
        ```
    - ลบ Goal โดย ID (DELETE `/api/goals/{id}`)
- ทดสอบ Transactions API (GET, POST) 
    - ดึง Transactions ของ Goal (GET `/api/goals/{id}/transactions`)
    - สร้าง Transaction สำหรับ Goal (POST `/api/goals/{id}/transactions`)
        - ตัวอย่าง Body:
        ```json
        {
            "amount": 10000,
            "type": "DEPOSIT",
            "note": "ฝากเงินเพิ่ม"
        }
        ```

### 2: Frontend Enhancements

##### 2.1: เพิ่ม composables `useAuth` ไว้จัดการ Authentication
```ts
// composables/useAuth.ts
import type { User } from '~/generated/prisma/client'

// State สำหรับเก็บข้อมูลผู้ใช้ (Global State)
export const useUser = () => useState<User | null>('user', () => null)

export const useAuth = () => {
  const user = useUser()
  const router = useRouter()

  // ฟังก์ชันสำหรับเข้าสู่ระบบ
  const login = async (credentials: any) => {
    try {
      const { user: loggedInUser } = await $fetch<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      user.value = loggedInUser
      return true
    } catch (error) {
      throw error
    }
  }

  // ฟังก์ชันสำหรับออกจากระบบ
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน (ใช้ตรวจสอบ Session)
  const fetchUser = async () => {
    try {
      // ส่ง Cookie ไปด้วยเพื่อให้ Server รู้ว่าเราคือใคร (จำเป็นสำหรับ SSR)
      const headers = useRequestHeaders(['cookie'])
      const { user: fetchedUser } = await $fetch<{ user: User | null }>('/api/auth/me', {
        headers
      })
      user.value = fetchedUser
    } catch (error) {
      user.value = null
    }
  }

  return {
    user,
    login,
    logout,
    fetchUser,
    // Computed property เพื่อเช็คว่าล็อกอินอยู่หรือไม่
    loggedIn: computed(() => !!user.value)
  }
}
```

##### 2.2: เพิ่ม Middleware `auth.ts` สำหรับตรวจสอบการเข้าถึงหน้า
```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()

  // ถ้ายังไม่มีข้อมูล user ใน state ให้ลอง fetch ใหม่ (กรณี refresh หน้าจอ)
  if (!user.value) {
    await fetchUser()
  }

  // ถ้ายังไม่มี user อีก แสดงว่าไม่ได้ login
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})
```
##### 2.3: เพิ่ม Middleware `guest.ts` ถ้ามี user อยู่แล้ว แสดงว่าเข้าสู่ระบบแล้ว ให้ไปที่หน้า /goals
```ts
// middleware/guest.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()

  // ถ้ายังไม่มีข้อมูล user ใน state ให้ลอง fetch ใหม่ (กรณี refresh หน้าจอ)
  if (!user.value) {
    await fetchUser()
  }

  // ถ้ามี user อยู่แล้ว แสดงว่าเข้าสู่ระบบแล้ว ให้ไปที่หน้า /goals
  if (user.value) {
    return navigateTo('/goals')
  }
})
```

##### 2.4 แก้ไขหน้า `app/pages/auth/login.vue` และ `app/pages/auth/register.vue` เพื่อใช้ guest middleware
```vue
<script setup lang="ts">
    definePageMeta({
        layout: 'auth',
        middleware: 'guest'
    })
</script>
```

##### 2.5 สร้างหน้า `app/pages/explore.vue` เพื่อแสดงเป้าหมายสาธารณะจากผู้ใช้คนอื่นๆ
```vue
<script setup lang="ts">

useHead({
  title: 'Explore Dreams - DreamBuddy',
  meta: [
    { 
      name: 'description', 
      content: 'See what others are saving for and get inspired by their goals on DreamBuddy.' 
    }
  ]
})

definePageMeta({
  auth: false // Allow public access
})

const { data: goals } = await useFetch('/api/explore/goals')

const getProgress = (saved: number, target: number) => {
  if (target === 0) return 0
  return Math.min(100, Math.round((saved / target) * 100))
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Explore Dreams</h1>
      <p class="text-gray-600">See what others are saving for and get inspired.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="goal in goals" :key="goal.id" class="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
        <template #header>
          <div class="flex items-center gap-3">
            <UAvatar :src="goal.owner?.avatarUrl ?? undefined" :alt="goal.owner?.username" size="sm" />
            <div class="overflow-hidden">
              <p class="text-sm font-medium truncate">{{ goal.owner?.name || goal.owner?.username }}</p>
              <p class="text-xs text-gray-500 truncate">@{{ goal.owner?.username }}</p>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <h3 class="font-bold text-lg truncate">{{ goal.title }}</h3>
          
          <div class="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span class="font-medium text-primary">{{ getProgress(Number(goal.savedAmount), Number(goal.targetAmount)) }}%</span>
          </div>
          <UProgress :model-value="getProgress(Number(goal.savedAmount), Number(goal.targetAmount))" size="sm" />
          
          <div class="flex justify-between items-end pt-2">
            <div>
               <p class="text-xs text-gray-500">Goal</p>
               <p class="font-semibold">{{ Number(goal.targetAmount).toLocaleString() }}</p>
            </div>
            <div class="flex items-center gap-1 text-red-500">
               <UIcon name="i-heroicons-heart" />
               <span class="text-sm">{{ goal.likesCount || 0 }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
```

##### 2.6 สร้างหน้า `app/pages/goals/index.vue` สำหรับแสดงรายการเป้าหมายของผู้ใช้
```vue
<script setup lang="ts">

useHead({
  title: 'My Goals',
  meta: [
    {
      name: 'description',
      content: 'View and manage your personal goals.'
    }
  ]
})

definePageMeta({
  middleware: 'auth'
})

const { data: goals, refresh } = await useFetch('/api/goals')

const getProgress = (saved: number, target: number) => {
  if (target === 0) return 0
  return Math.min(100, Math.round((saved / target) * 100))
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">My Goals</h1>
      <UButton to="/goals/create" icon="i-heroicons-plus" color="primary">
        New Goal
      </UButton>
    </div>

    <div v-if="goals?.length === 0" class="text-center py-12 text-gray-500">
      <p>You don't have any goals yet.</p>
      <UButton to="/goals/create" variant="link" class="mt-2">Create one now</UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="goal in goals" :key="goal.id" class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo(`/goals/${goal.id}`)">
        <template #header>
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold">{{ goal.title }}</h3>
              <p class="text-sm text-gray-500">{{ goal.category || 'Uncategorized' }}</p>
            </div>
            <UBadge :color="goal.visibility === 'PRIVATE' ? 'neutral' : goal.visibility === 'PUBLIC' ? 'success' : 'warning'" size="xs">
              {{ goal.visibility }}
            </UBadge>
          </div>
        </template>

        <div class="space-y-4">
          <div v-if="goal.imageUrl" class="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img :src="goal.imageUrl" alt="Goal image" class="w-full h-full object-cover" />
          </div>
          
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span class="font-medium">{{ getProgress(Number(goal.savedAmount), Number(goal.targetAmount)) }}%</span>
            </div>
            <UProgress :model-value="getProgress(Number(goal.savedAmount), Number(goal.targetAmount))" color="primary" />
          </div>

          <div class="flex justify-between text-sm">
            <div>
              <p class="text-gray-500">Saved</p>
              <p class="font-semibold">{{ Number(goal.savedAmount).toLocaleString() }}</p>
            </div>
            <div class="text-right">
              <p class="text-gray-500">Target</p>
              <p class="font-semibold">{{ Number(goal.targetAmount).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
```

###### 2.7 สร้างหน้า `app/pages/goals/[id].vue` สำหรับแสดงรายละเอียดเป้าหมาย
```vue
<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'auth' // Or custom middleware to allow public access if public
})

const { $t } = useI18n()
const route = useRoute()
const goalId = route.params.id

// Fetch goal details
const { data: goal, refresh: refreshGoal, error } = await useFetch(`/api/goals/${goalId}`)
const { data: transactions, refresh: refreshTransactions } = await useFetch(`/api/goals/${goalId}/transactions`)

// Transaction Form
const isDepositModalOpen = ref(false)
const transactionSchema = z.object({
  amount: z.number({
    message: String($t('goals.transaction.amountInvalid') || 'Amount must be a number')
  }).positive(String($t('goals.transaction.amountPositive') || 'Amount must be positive')),
  type: z.enum(['DEPOSIT', 'WITHDRAW'], {
    message: String($t('goals.transaction.typeRequired') || 'Type is required')
  }),
  note: z.string().optional()
})
type TransactionSchema = z.output<typeof transactionSchema>

const transactionState = reactive({
  amount: 0,
  type: 'DEPOSIT' as const,
  note: ''
})

const transactionTypes = computed(() => [
  { value: 'DEPOSIT', label: String($t('goals.transaction.deposit') || 'Deposit (Save)') },
  { value: 'WITHDRAW', label: String($t('goals.transaction.withdraw') || 'Withdraw') }
])

const loading = ref(false)
const toast = useToast()

async function onTransactionSubmit(event: FormSubmitEvent<TransactionSchema>) {
  loading.value = true
  try {
    await $fetch(`/api/goals/${goalId}/transactions`, {
      method: 'POST',
      body: event.data
    })
    toast.add({ 
      title: String($t('goals.transaction.successTitle') || 'Success'), 
      description: String($t('goals.transaction.successMessage') || 'Transaction recorded'),
      color: 'success'
    })
    isDepositModalOpen.value = false
    transactionState.amount = 0
    transactionState.note = ''
    refreshGoal()
    refreshTransactions()
  } catch (err: any) {
    toast.add({ 
      title: String($t('goals.transaction.errorTitle') || 'Error'), 
      description: err.data?.statusMessage || err.message || String($t('goals.transaction.errorMessage') || 'Failed to record transaction'), 
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}

const getProgress = (saved: number, target: number) => {
  if (!target) return 0
  return Math.min(100, Math.round((saved / target) * 100))
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

const copyLink = () => {
  const shareUrl = `${window.location.origin}/goals/share/${goal.value?.shareSlug}`
  navigator.clipboard.writeText(shareUrl)
  toast.add({ title: 'Link copied!', description: 'Share link copied to clipboard' })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="error" class="text-center text-red-500">
      {{ error.statusMessage || 'Error loading goal' }}
    </div>

    <div v-else-if="goal" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Goal Info -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between">
          <UButton to="/goals" variant="ghost" icon="i-heroicons-arrow-left">Back</UButton>
          <div class="flex gap-2">
             <UBadge :color="goal.visibility === 'PRIVATE' ? 'neutral' : 'success'">{{ goal.visibility }}</UBadge>
             <UButton v-if="goal.visibility === 'LINK_ONLY'" icon="i-heroicons-link" variant="ghost" color="neutral" @click="copyLink" />
          </div>
        </div>

        <UCard>
          <div class="flex flex-col md:flex-row gap-6">
            <div v-if="goal.imageUrl" class="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img :src="goal.imageUrl" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <h1 class="text-3xl font-bold mb-2">{{ goal.title }}</h1>
              <p class="text-gray-500 mb-4">{{ goal.category }}</p>
              <p v-if="goal.note" class="text-gray-700 mb-4">{{ goal.note }}</p>
              
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="font-medium">Progress ({{ getProgress(Number(goal.savedAmount), Number(goal.targetAmount)) }}%)</span>
                  <span class="text-gray-500">Target Date: {{ formatDate(goal.targetDate) }}</span>
                </div>
                <UProgress :model-value="getProgress(Number(goal.savedAmount), Number(goal.targetAmount))" size="lg" />
                <div class="flex justify-between items-end mt-2">
                  <div>
                    <p class="text-sm text-gray-500">Saved</p>
                    <p class="text-2xl font-bold text-primary">{{ Number(goal.savedAmount).toLocaleString() }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Target</p>
                    <p class="text-xl font-semibold">{{ Number(goal.targetAmount).toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <template #footer>
             <div class="flex justify-end">
                <UButton icon="i-heroicons-plus" size="lg" @click="isDepositModalOpen = true">Add Savings</UButton>
             </div>
          </template>
        </UCard>

        <!-- Transactions History -->
        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">History</h2>
          <UCard v-if="transactions?.length">
              <div v-for="tx in transactions" :key="tx.id" class="py-3 flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div :class="`py-2 px-3 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`">
                    <UIcon :name="tx.type === 'DEPOSIT' ? 'i-heroicons-arrow-up' : 'i-heroicons-arrow-down'" />
                  </div>
                  <div>
                    <p class="font-medium">{{ tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdraw' }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(tx.createdAt) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p :class="`font-bold ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`">
                    {{ tx.type === 'DEPOSIT' ? '+' : '-' }}{{ Number(tx.amount).toLocaleString() }}
                  </p>
                  <p v-if="tx.note" class="text-xs text-gray-500">{{ tx.note }}</p>
                </div>
              </div>
          </UCard>
          <div v-else class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No transactions yet.
          </div>
        </div>
      </div>

      <!-- Right Column: Stats / Social (Placeholder) -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h3 class="font-semibold">Details</h3>
          </template>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Created</span>
              <span>{{ formatDate(goal.createdAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Owner</span>
              <span>{{ goal.owner?.name || goal.owner?.username }}</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <UModal v-model:open="isDepositModalOpen" :title="String($t('goals.transaction.addTransaction') || 'Add Transaction')">
      <template #body>
        <UForm :schema="transactionSchema" :state="transactionState" @submit="onTransactionSubmit" class="space-y-4">
          <UFormField :label="String($t('goals.transaction.type') || 'Type')" name="type">
            <URadioGroup v-model="transactionState.type" :items="transactionTypes" />
          </UFormField>

          <UFormField :label="String($t('goals.transaction.amount') || 'Amount')" name="amount" required>
            <UInput v-model.number="transactionState.amount" type="number" placeholder="0.00" autofocus />
          </UFormField>

          <UFormField :label="String($t('goals.transaction.note') || 'Note')" name="note">
            <UInput v-model="transactionState.note" :placeholder="String($t('goals.transaction.notePlaceholder') || 'Optional note')" />
          </UFormField>

          <div class="flex justify-end gap-2 mt-4">
            <UButton color="neutral" variant="ghost" @click="isDepositModalOpen = false">{{ $t('common.cancel') || 'Cancel' }}</UButton>
            <UButton type="submit" color="primary" :loading="loading">{{ $t('common.save') || 'Save' }}</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
```

###### 2.8 สร้างหน้า `app/pages/goals/create.vue` สำหรับสร้างเป้าหมายใหม่
```vue
<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'auth'
})

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  targetAmount: z.number().positive('Amount must be positive'),
  targetDate: z.string().refine((date) => new Date(date) > new Date(), 'Date must be in the future'),
  category: z.string().optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC', 'LINK_ONLY']),
  note: z.string().optional(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal(''))
})

type Schema = z.output<typeof schema>

const state = reactive({
  title: '',
  targetAmount: 0,
  targetDate: '',
  category: 'General',
  visibility: 'PRIVATE' as const,
  note: '',
  imageUrl: ''
})

const categories = ['General', 'Travel', 'Gadget', 'Education', 'Vehicle', 'Home', 'Emergency Fund', 'Investment']
const visibilities = [
  { label: 'Private', value: 'PRIVATE' },
  { label: 'Public', value: 'PUBLIC' },
  { label: 'Link Only', value: 'LINK_ONLY' }
]

const loading = ref(false)
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $fetch('/api/goals', {
      method: 'POST',
      body: event.data
    })
    toast.add({ title: 'Success', description: 'Goal created successfully' })
    navigateTo('/goals')
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to create goal', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <div class="mb-6">
      <UButton to="/goals" variant="ghost" icon="i-heroicons-arrow-left">Back to Goals</UButton>
      <h1 class="text-2xl font-bold mt-2">Create New Goal</h1>
    </div>

    <UCard>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Goal Title" name="title" required>
          <UInput v-model="state.title" placeholder="e.g. Dream Vacation" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Target Amount" name="targetAmount" required>
            <UInput v-model.number="state.targetAmount" type="number" placeholder="0.00" class="w-full" />
          </UFormField>

          <UFormField label="Target Date" name="targetDate" required>
            <UInput v-model="state.targetDate" type="date" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Category" name="category">
          <USelect v-model="state.category" :items="categories" class="w-full" />
        </UFormField>

        <UFormField label="Visibility" name="visibility">
          <URadioGroup v-model="state.visibility" :items="visibilities" />
        </UFormField>

        <UFormField label="Image URL (Optional)" name="imageUrl">
          <UInput v-model="state.imageUrl" placeholder="https://..." class="w-full" />
        </UFormField>

        <UFormField label="Note" name="note">
          <UTextarea v-model="state.note" placeholder="Why do you want to save for this?" class="w-full" />
        </UFormField>

        <div class="flex justify-end pt-4">
          <UButton type="submit" color="primary" :loading="loading">
            Create Goal
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
```

###### 2.9 แก้ไข `app/components/App/Header.vue` เพื่อเพิ่มลิงก์ไปยังหน้า Explore และ Goals
```vue
<script setup lang="ts">

// สำหรับการแปลภาษา
const { $t, $localePath } = useI18n()

// User state
const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
  isMobileMenuOpen.value = false
}

// ตัวแปร state สำหรับ mobile menu
const isMobileMenuOpen = ref(false)

// ตัวแปรลิงก์การนำทาง
const navLinks = computed(() => {
  const common = [
    { name: $t('nav.explore') || 'Explore', href: $localePath('/explore') }
  ]
  
  if (user.value) {
    return [
      { name: $t('nav.myGoals') || 'My Goals', href: $localePath('/goals') },
      ...common
    ]
  }
  
  return [
    { name: $t('nav.features'), href: '/#features' },
    { name: $t('nav.howItWorks'), href: '/#how-it-works' },
    { name: $t('nav.community'), href: '/#community' },
    { name: $t('nav.testimonials'), href: '/#testimonials' },
    ...common
  ]
})

const route = useRoute()

// สำหรับการเลื่อนหน้าแบบนุ่มนวลพร้อมการชดเชยสำหรับส่วนหัวที่ติดอยู่
const handleNavClick = (e: MouseEvent, href: string) => {
  // ถ้าเป็นลิงก์ภายในหน้า (Anchor) และเราอยู่ที่หน้า Home
  if (href.startsWith('/#') && route.path === '/') {
    e.preventDefault()
    const targetId = href.substring(2) // Remove '/#'
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      const headerOffset = 65
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
  
  // ปิด mobile menu หลังจากคลิก
  isMobileMenuOpen.value = false
}

// สำหรับการเลื่อนขึ้นบนสุดเมื่อคลิกโลโก้
const scrollToTop = (e: Event) => {
  e.preventDefault()
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// ฟังก์ชัน toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a 
          href="#" 
          @click="scrollToTop"
          class="flex items-center space-x-2 cursor-pointer"
          aria-label="DreamBuddy Home"
        >
          <Icon name="i-heroicons-sparkles" class="w-8 h-8 text-primary" />
          <span class="text-xl font-bold bg-linear-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent">
            DreamBuddy
          </span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            v-for="(link, index) in navLinks" 
            :key="index"
            :to="link.href"
            @click="handleNavClick($event, link.href)"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors cursor-pointer"
            :active-class="link.href.includes('#') ? '' : 'text-primary-500 font-medium'"
          >
            {{ link.name }}
          </NuxtLink>
        </div>

        <!-- Desktop CTA Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Language Switcher -->
          <AppLanguageSwitcher />
          
          <!-- Theme Toggle -->
          <AppThemeToggle />
          
          <template v-if="!user">
            <UButton variant="ghost" size="md" class="cursor-pointer" @click="$router.push($localePath('/auth/login'))">
              {{ $t('nav.signIn') }}
            </UButton>
            <UButton size="md" color="primary" class="cursor-pointer" @click="$router.push($localePath('/auth/register'))">
              {{ $t('nav.startFree') }}
            </UButton>
          </template>
          <template v-else>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ user.name || user.username }}
              </span>
              <UButton 
                color="neutral" 
                variant="ghost" 
                icon="i-heroicons-arrow-right-start-on-rectangle"
                @click="handleLogout"
                class="cursor-pointer"
              />
            </div>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex md:hidden items-center space-x-2">
          <!-- Language Switcher (Mobile) -->
          <AppLanguageSwitcher />
          
          <!-- Theme Toggle (Mobile) -->
          <AppThemeToggle />
          
          <!-- Hamburger Button -->
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
            :aria-expanded="isMobileMenuOpen"
          >
            <Icon 
              :name="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" 
              class="w-6 h-6 text-gray-600 dark:text-gray-300" 
            />
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div 
          v-if="isMobileMenuOpen" 
          class="md:hidden py-4 border-t border-gray-200 dark:border-gray-800"
        >
          <!-- Mobile Navigation Links -->
          <div class="flex flex-col space-y-3 mb-4">
            <NuxtLink 
              v-for="(link, index) in navLinks" 
              :key="index"
              :to="link.href"
              @click="handleNavClick($event, link.href)"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
              :active-class="link.href.includes('#') ? '' : 'text-primary-500 bg-gray-50 dark:bg-gray-800/50'"
            >
              {{ link.name }}
            </NuxtLink>
          </div>

          <!-- Mobile CTA Buttons -->
          <div class="flex flex-col space-y-2 px-4">
            <template v-if="!user">
              <UButton variant="ghost" size="md" block class="cursor-pointer" @click="$router.push($localePath('/auth/login')); isMobileMenuOpen = false">
                {{ $t('nav.signIn') }}
              </UButton>
              <UButton size="md" color="primary" block class="cursor-pointer" @click="$router.push($localePath('/auth/register')); isMobileMenuOpen = false">
                {{ $t('nav.startFree') }}
              </UButton>
            </template>
            <template v-else>
              <div class="px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 mb-2">
                {{ user.name || user.username }}
              </div>
              <UButton 
                color="neutral" 
                variant="ghost" 
                block
                icon="i-heroicons-arrow-right-start-on-rectangle"
                @click="handleLogout"
                class="cursor-pointer justify-start"
              >
                Logout
              </UButton>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
</style>
```

> ทำการ commit และ checkout new branch
    git add .
    git commit -m "Add Vercel deployment configuration"
    git checkout -b vercel-deployment

## 3: Build and Deployment to Vercel

- สร้างไฟล์ `vercel.json` ในโฟลเดอร์รากของโปรเจค
```json
{
  "version": 2,
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@vercel/nuxt"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```
- ทำการ commit การเปลี่ยนแปลง
    git add vercel.json
    git commit -m "Add Vercel deployment configuration"
- ไปที่ [Vercel Dashboard](https://vercel.com/dashboard) และสร้างโปรเจคใหม่
- เลือก Git Repository ของโปรเจคที่เราได้ push ขึ้น
- ตั้งค่า Environment Variables ที่จำเป็น เช่น `DATABASE_URL`, `SESSION_SECRET`
- กด Deploy และรอจนกว่าโปรเจคจะถูก deploy สำเร็จ

