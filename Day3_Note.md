## Full Stack Nuxt 4 with Prisma and PostgreSQL - Day 3

## 0: 📋 สารบัญ
1. [Create Rest API for Authentication](#create-rest-api-for-authentication) * (dev-restapi)
2. [Dev Authentication Integration](#dev-authentication-integration) * (dev-auth-integration)

## 1: Create Rest API for Authentication
```
dreambuddy/
├─ app/
│  ├─ server/
│  │  ├─ api/
│  │  │  ├─ auth/
│  │  │  │  ├─ login.post.ts
│  │  │  │  ├─ register.post.ts
│  │  │  │  ├─ me.get.ts
│  │  │  │  ├─ logout.post.ts
│  │  ├─ utils/
│  │  │  ├─ prisma.ts
│  │  │  ├─ auth.ts
```

##### 1.1 ติดตั้งแพ็กเกจที่ใช้
```bash
bun add bcryptjs jsonwebtoken zod
bun add -d @types/bcryptjs @types/jsonwebtoken
```

##### 1.2 เพิ่มตัวแปรใน .env
```
JWT_SECRET=super-secret-key-change-this
JWT_EXPIRES_IN=7d
```
> Tip ใช้ node.js generate a random secret key
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

##### 1.3 สร้างไฟล์ `app/server/utils/prisma.ts` เพื่อเชื่อมต่อ Prisma Client
```ts
import { PrismaClient } from '../../app/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn']
  })

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}
```

##### 1.4 สร้าง helper สำหรับ Auth ใน `app/server/utils/auth.ts`
```ts
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
```

##### 1.5 สร้าง API สำหรับ Register ใน `app/server/api/auth/register.post.ts`
```ts
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

  const { name, username, email, password } = parsed.data

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

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      passwordHash,
    },
  })

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
```

##### 1.6 สร้าง API สำหรับ Login ใน `app/server/api/auth/login.post.ts`
```ts
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
```

##### 1.7 สร้าง API สำหรับดึงข้อมูลผู้ใช้ปัจจุบันใน `app/server/api/auth/me.get.ts`
```ts
import { getCurrentUser } from "../../utils/auth"

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)

  if (!user) {
    return { user: null }
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    }
  }
})
```

##### 1.8 สร้าง API สำหรับ Logout ใน `app/server/api/auth/logout.post.ts`
```ts
import { clearAuthCookie } from "../../utils/auth"

export default defineEventHandler(async (event) => {
  clearAuthCookie(event)
  return { success: true }
})
```

##### 1.9 ทดสอบการทำงานโดยรันคำสั่ง
```
bun run dev
```

##### 1.10 ใช้ Postman หรือ Insomnia ทดสอบ API
- ทดสอบ Register: POST `http://localhost:3000/api/auth/register`
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```
- ทดสอบ Login: POST `http://localhost:3000/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- ทดสอบ Logout: POST `http://localhost:3000/api/auth/logout`


> ทำการ commit และ checkout new branch
  git add .
  git commit -m "Created REST API for authentication (register, login, logout)"
  git checkout -b dev-auth-integration


## 2: Integrate Auth API with Frontend
```dreambuddy/
├─ app/
│  ├─ components/
│  ├─ App /
│  │  ├─ Header.vue
│  ├─ pages/
│  │  ├─ auth/
│  │  │  ├─ login.vue
│  │  │  ├─ register.vue
```

##### 2.1 แก้ไขไฟล์ `app/pages/auth/login.vue` เพื่อเชื่อมต่อกับ API ที่สร้างขึ้น
```vue
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { $t, $localePath } = useI18n()
const toast = useToast()
const router = useRouter()

definePageMeta({
  layout: 'auth'
})

useHead({
  title: $t('auth.login.signIn') as string,
  meta: [
    {
      name: 'description',
      content: $t('auth.login.subtitle') as string
    }
  ]
})

const schema = z.object({
  email: z.string().email(String($t('auth.login.invalidEmail') || 'Invalid email')),
  password: z.string().min(6, String($t('auth.login.passwordTooShort') || 'Password must be at least 6 characters'))
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const isLoading = ref(false)

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: event.data.email,
        password: event.data.password
      }
    })
    
    toast.add({ 
      title: String($t('auth.login.successTitle') || 'Success'), 
      description: String($t('auth.login.successMessage') || 'Logged in successfully'), 
      color: 'success' 
    })
    
    await navigateTo($localePath('/'))
  } catch (error: any) {
    toast.add({ 
      title: String($t('auth.login.errorTitle') || 'Error'), 
      description: error.data?.statusMessage || error.message || String($t('auth.login.errorMessage') || 'Login failed'), 
      color: 'error' 
    })
  } finally {
    isLoading.value = false
  }
}

const handleSocialLogin = (provider: string) => {
  // TODO: Implement social login
  console.log('Login with:', provider)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center lg:text-left">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t('auth.login.title') }}
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('auth.login.subtitle') }}
      </p>
    </div>

    <!-- Social Login Buttons -->
    <div class="space-y-3">
      <UButton
        @click="handleSocialLogin('google')"
        block
        size="lg"
        variant="outline"
        color="neutral"
        class="cursor-pointer"
      >
        <Icon name="i-heroicons-globe-alt" class="w-5 h-5" />
        {{ $t('auth.login.continueWithGoogle') }}
      </UButton>
      <UButton
        @click="handleSocialLogin('github')"
        block
        size="lg"
        variant="outline"
        color="neutral"
        class="cursor-pointer"
      >
        <Icon name="i-heroicons-code-bracket" class="w-5 h-5" />
        {{ $t('auth.login.continueWithGithub') }}
      </UButton>
    </div>

    <!-- Divider -->
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-4 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
          {{ $t('auth.login.orContinueWith') }}
        </span>
      </div>
    </div>

    <!-- Login Form -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <!-- Email -->
      <UFormField :label="String($t('auth.login.email'))" name="email">
        <UInput
          v-model="state.email"
          type="email"
          :placeholder="String($t('auth.login.emailPlaceholder'))"
          size="lg"
          autocomplete="email"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </UFormField>

      <!-- Password -->
      <UFormField :label="String($t('auth.login.password'))" name="password">
        <UInput
          v-model="state.password"
          type="password"
          :placeholder="String($t('auth.login.passwordPlaceholder'))"
          size="lg"
          autocomplete="current-password"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </UFormField>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <UCheckbox 
            v-model="state.rememberMe" 
            name="remember-me" 
            :label="String($t('auth.login.rememberMe'))" 
          />
        </div>
        <NuxtLink
          :to="$localePath('/auth/forgot-password')"
          class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {{ $t('auth.login.forgotPassword') }}
        </NuxtLink>
      </div>

      <!-- Submit Button -->
      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        :loading="isLoading"
        :disabled="isLoading"
        class="cursor-pointer"
      >
        {{ $t('auth.login.signIn') }}
      </UButton>
    </UForm>

    <!-- Sign Up Link -->
    <div class="text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('auth.login.noAccount') }}
        <NuxtLink
          :to="$localePath('/auth/register')"
          class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {{ $t('auth.login.signUp') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
```

##### 2.2 แก้ไขไฟล์ `app/pages/auth/register.vue` เพื่อเชื่อมต่อกับ API ที่สร้างขึ้น
```vue
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { $t, $localePath } = useI18n()
const toast = useToast()

definePageMeta({
  layout: 'auth'
})

useHead({
  title: $t('auth.login.signUp') as string,
  meta: [
    {
      name: 'description',
      content: $t('auth.register.subtitle') as string
    }
  ]
})

const schema = z.object({
  name: z.string().min(1, String($t('auth.register.nameRequired') || 'Name is required')),
  username: z.string().min(3, String($t('auth.register.usernameTooShort') || 'Username must be at least 3 characters')),
  email: z.string().email(String($t('auth.login.invalidEmail') || 'Invalid email')),
  password: z.string().min(6, String($t('auth.login.passwordTooShort') || 'Password must be at least 6 characters')),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: String($t('auth.register.mustAgreeTerms') || 'You must agree to the terms')
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: String($t('auth.register.passwordsDoNotMatch') || 'Passwords do not match'),
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const state = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const isLoading = ref(false)

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: event.data.name,
        username: event.data.username,
        email: event.data.email,
        password: event.data.password
      }
    })
    
    toast.add({ 
      title: String($t('auth.login.successTitle') || 'Success'), 
      description: String($t('auth.register.successMessage') || 'Account created successfully'), 
      color: 'success' 
    })
    
    await navigateTo($localePath('/auth/login'))
  } catch (error: any) {
    toast.add({ 
      title: String($t('auth.login.errorTitle') || 'Error'), 
      description: error.data?.statusMessage || error.message || String($t('auth.register.errorMessage') || 'Registration failed'), 
      color: 'error' 
    })
  } finally {
    isLoading.value = false
  }
}

const handleSocialRegister = (provider: string) => {
  // TODO: Implement social register
  console.log('Register with:', provider)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center lg:text-left">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t('auth.register.title') }}
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('auth.register.subtitle') }}
      </p>
    </div>

    <!-- Social Register Buttons -->
    <div class="space-y-3">
      <UButton
        @click="handleSocialRegister('google')"
        block
        size="lg"
        variant="outline"
        color="neutral"
        class="cursor-pointer"
      >
        <Icon name="i-heroicons-globe-alt" class="w-5 h-5" />
        {{ $t('auth.register.continueWithGoogle') }}
      </UButton>
      <UButton
        @click="handleSocialRegister('github')"
        block
        size="lg"
        variant="outline"
        color="neutral"
        class="cursor-pointer"
      >
        <Icon name="i-heroicons-code-bracket" class="w-5 h-5" />
        {{ $t('auth.register.continueWithGithub') }}
      </UButton>
    </div>

    <!-- Divider -->
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-4 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
          {{ $t('auth.register.orRegisterWith') }}
        </span>
      </div>
    </div>

    <!-- Register Form -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <!-- Name -->
      <UFormField :label="String($t('auth.register.name'))" name="name">
        <UInput
          v-model="state.name"
          type="text"
          :placeholder="String($t('auth.register.namePlaceholder'))"
          size="lg"
          autocomplete="name"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-user" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </UFormField>

      <!-- Username -->
      <UFormField :label="String($t('auth.register.username') || 'Username')" name="username">
        <UInput
          v-model="state.username"
          type="text"
          :placeholder="String($t('auth.register.usernamePlaceholder') || 'Enter your username')"
          size="lg"
          autocomplete="username"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-at-symbol" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </UFormField>

      <!-- Email -->
      <UFormField :label="String($t('auth.register.email'))" name="email">
        <UInput
          v-model="state.email"
          type="email"
          :placeholder="String($t('auth.register.emailPlaceholder'))"
          size="lg"
          autocomplete="email"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </UFormField>

      <!-- Password -->
      <UFormField :label="String($t('auth.register.password'))" name="password">
        <UInput
          v-model="state.password"
          type="password"
          :placeholder="String($t('auth.register.passwordPlaceholder'))"
          size="lg"
          autocomplete="new-password"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </UFormField>

      <!-- Confirm Password -->
      <UFormField :label="String($t('auth.register.confirmPassword'))" name="confirmPassword">
        <UInput
          v-model="state.confirmPassword"
          type="password"
          :placeholder="String($t('auth.register.confirmPasswordPlaceholder'))"
          size="lg"
          autocomplete="new-password"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </UFormField>

      <!-- Terms & Conditions -->
      <UFormField name="agreeTerms">
        <UCheckbox v-model="state.agreeTerms" name="agree-terms">
          <template #label>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ $t('auth.register.agreeToTerms') }}
              <NuxtLink :to="$localePath('/terms')" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                {{ $t('auth.register.termsOfService') }}
              </NuxtLink>
              {{ $t('auth.register.and') }}
              <NuxtLink :to="$localePath('/privacy')" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                {{ $t('auth.register.privacyPolicy') }}
              </NuxtLink>
            </span>
          </template>
        </UCheckbox>
      </UFormField>

      <!-- Submit Button -->
      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        :loading="isLoading"
        :disabled="isLoading"
        class="cursor-pointer"
      >
        {{ $t('auth.register.createAccount') }}
      </UButton>
    </UForm>

    <!-- Sign In Link -->
    <div class="text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('auth.register.haveAccount') }}
        <NuxtLink
          :to="$localePath('/auth/login')"
          class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {{ $t('auth.register.signIn') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
```

##### 2.3 แก้ไขไฟล์ `app/app.vue` เพื่อกำหนดการแสดงผล Toast
```vue
<script setup lang="ts">
const { $switchLocale, $getLocale } = useI18n()

// โหลดภาษาจาก localStorage เมื่อแอพเริ่มต้น
onMounted(() => {
  if (import.meta.client) {
    const savedLocale = localStorage.getItem('dreambuddy-locale')
    if (savedLocale && savedLocale !== $getLocale()) {
      $switchLocale(savedLocale)
    }
  }
})
</script>

<template>
  <UApp :toaster="{ position: 'top-right', duration: 2000 }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

##### 2.4 แก้ไขไฟล์ `app/components/Header.vue` เพื่อแสดงสถานะการล็อกอิน
```vue
<script setup lang="ts">

// สำหรับการแปลภาษา
const { $t, $localePath } = useI18n()

// User state
const user = useState<{ id: number; username: string; email: string; name: string | null } | null>('user', () => null)

// Fetch user on mount
const { data: authData } = await useFetch('/api/auth/me')
if (authData.value?.user) {
  user.value = authData.value.user
}

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  user.value = null
  await navigateTo($localePath('/'))
  isMobileMenuOpen.value = false
}

// ตัวแปร state สำหรับ mobile menu
const isMobileMenuOpen = ref(false)

// ตัวแปรลิงก์การนำทาง
const navLinks = computed(() => [
  { name: $t('nav.features'), href: '#features' },
  { name: $t('nav.howItWorks'), href: '#how-it-works' },
  { name: $t('nav.community'), href: '#community' },
  { name: $t('nav.testimonials'), href: '#testimonials' },
])

// สำหรับการเลื่อนหน้าแบบนุ่มนวลพร้อมการชดเชยสำหรับส่วนหัวที่ติดอยู่
const scrollToSection = (e: Event, href: string) => {
  e.preventDefault()
  const targetId = href.substring(1) // Remove '#'
  const targetElement = document.getElementById(targetId)
  
  if (targetElement) {
    const headerOffset = 65 // Height of sticky header + some padding
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
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
          <a 
            v-for="(link, index) in navLinks" 
            :key="index"
            :href="link.href"
            @click="scrollToSection($event, link.href)"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors cursor-pointer"
          >
            {{ link.name }}
          </a>
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
            <a 
              v-for="(link, index) in navLinks" 
              :key="index"
              :href="link.href"
              @click="scrollToSection($event, link.href)"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
            >
              {{ link.name }}
            </a>
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

##### 2.5 ทดสอบการทำงานโดยรันคำสั่ง
```
bun run dev
```