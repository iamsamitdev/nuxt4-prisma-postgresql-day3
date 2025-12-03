import { verifyToken } from "../utils/auth"

export default defineEventHandler((event) => {
    // console.log("Auth middleware triggered")
    // อ่าน Cookie ชื่อ dreambuddy_token
    const token = getCookie(event, 'dreambuddy_token')

    // ถ้ามี token ให้ตรวจสอบความถูกต้อง
    if (token) {
        // ตรวจสอบ token
        const payload = verifyToken(token)

        // ถ้า token ถูกต้อง ให้แนบข้อมูลผู้ใช้ลงใน event.context
        if (payload) {
            event.context.auth = payload
        }
    }
})