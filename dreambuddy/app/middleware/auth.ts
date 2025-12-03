export default defineNuxtRouteMiddleware(async (to, from) => {
    // อ่าน Cookie ชื่อ dreambuddy_token
    const token = useCookie('dreambuddy_token').value

    console.log('Auth Middleware: token =', token)

    // ถ้าไม่มี token ให้ไปที่หน้า login
    if (!token) {
       return navigateTo('/auth/login')
    }
})