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