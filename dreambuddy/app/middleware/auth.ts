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