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