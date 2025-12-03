## Full Stack Nuxt 4 with Prisma and PostgreSQL - Day 2

## 0: 📋 สารบัญ

1. [Workshop dreambuddy](#workshop-dreambuddy)
2. [Create New Project](#create-new-project)
3. [Setup Tailwind CSS](#setup-tailwind-css)
4. [Setup Nuxt UI](#setup-nuxt-ui)
5. [Create Component for App](#create-component-for-app) * (dev-start)
6. [Create Component for Landing](#create-component-for-landing)
7. [Create Landing Page](#create-landing-page)
8. [Create Layout](#create-layout)
9. [Setup Google Fonts](#setup-google-fonts)
10. [Setup Dark Mode](#setup-dark-mode) * (dev-darkmode)
11. [Setup i18n](#setup-i18n) * (dev-i18n)
12. [Create Auth Layout](#create-auth-layout) * (dev-auth)
13. [Create Login Page](#create-login-page)
14. [Create Register Page](#create-register-page)
15. [Create Forgot Password Page](#create-forgot-password-page)
16. [Persist Language Selection](#persist-language-selection) * (dev-prisma)
17. [Setup Prisma and PostgreSQL](#setup-prisma-and-postgresql)
18. [Create Rest API for Authentication](#create-rest-api-for-authentication) * (dev-restapi)
19. [Dev Authentication Integration](#dev-authentication-integration) * (dev-auth-integration)

## 1: Workshop dreambuddy
##### วัตถุประสงค์
- สร้างโปรเจค Nuxt 4 ด้วย Bun
- ติดตั้ง Tailwind CSS และ Nuxt UI
- สร้าง Layout และหน้า Landing Page เบื้องต้น
- ตั้งค่า Google Fonts
- ตั้งค่า Dark Mode
- สร้าง Layout และหน้าสำหรับการยืนยันตัวตน (Authentication)
- ตั้งค่า i18n สำหรับหลายภาษา
- ตั้งค่า Prisma และเชื่อมต่อกับฐานข้อมูล PostgreSQL
- สร้าง REST API สำหรับการยืนยันตัวตน (Authentication)

## 2: Create New Project
##### 2.1 Open Command Prompt (Windows) or Terminal (Mac/Linux) and run the following command to create a new Nuxt 4 project named "dreambuddy":
```bash
bun create nuxt@latest dreambuddy
## เลือกตัวเลือกดังนี้
> Which Package Manager would you like to use? › Bun (current)
> Initialize git repository? › No
> Would you like to install any of the official modules? › No
```

##### 2.2 Open the project in VSCode
```bash
code dreambuddy
```

##### 2.3 Run the Nuxt 4 project with Bun
```bash
bun run dev
```

##### 2.4 Open the browser
เปิดเบราว์เซอร์แล้วเข้าไปที่ URL: `http://localhost:3000` จะเห็นหน้าเว็บต้อนรับของ Nuxt 4 แสดงขึ้นมา

## 3: Setup Tailwind CSS
##### 3.1 รันคำสั่งติดตั้ง Tailwind CSS
```bash
bun add tailwindcss @tailwindcss/vite
```
##### 3.2 เพิ่มปลั๊กอิน @tailwindcss/vite ในการตั้งค่า Nuxt ของคุณในฐานะปลั๊กอิน Vite
เปิดไฟล์ `nuxt.config.ts` แล้วเพิ่มโค้ดดังนี้
```ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
```

##### 3.3 Import Tailwind CSS
สร้างไฟล์ `app/assets/css/main.css` แล้วเพิ่มโค้ดดังนี้
```css
@import "tailwindcss";
```

##### 3.4 จากนั้นเปิดไฟล์ `nuxt.config.ts` แล้วเพิ่มโค้ดดังนี้
```ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
```
##### 3.5 Start using Tailwind in your project
เปิดไฟล์ `app/pages/index.vue` แล้วเพิ่มโค้ดดังนี้
```vue
<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</template>
```

##### 3.6 รันคำสั่ง `bun run dev` แล้วเปิดเบราว์เซอร์เข้าไปที่ URL: `http://localhost:3000` จะเห็นข้อความ "Hello world!" แสดงขึ้นมาพร้อมกับสไตล์ของ Tailwind CSS

## 4: Setup Nuxt UI
##### 4.1 รันคำสั่งติดตั้ง Nuxt UI
```bash
bun add @nuxt/ui
```

##### 4.2 เปิดไฟล์ `nuxt.config.ts` แล้วเพิ่มโค้ดดังนี้
```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

##### 4.3 Import Tailwind CSS and Nuxt UI in your CSS
เปิดไฟล์ `app/assets/css/main.css` แล้วเพิ่มโค้ดดังนี้
```css
@import "tailwindcss";
@import "@nuxt/ui";
```

##### 4.4 เปิดไฟล์ `app/app.vue` แล้วเพิ่มโค้ดดังนี้
```vue
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

##### 4.5 รันคำสั่ง `bun run dev` แล้วเปิดเบราว์เซอร์เข้าไปที่ URL: `http://localhost:3000` จะเห็นข้อความ "Hello world!" แสดงขึ้นมาพร้อมกับสไตล์ของ Tailwind CSS และ Nuxt UI

> ทำการ commit และ checkout new branch
  git add .
  git commit -m "Setup Tailwind CSS and Nuxt UI"
  git checkout -b dev-start

## 5: Create Component for App

```
dreambuddy/
├─ app/
│  ├─ components/
│  │  ├─ App/
│  │  │  ├─ Footer.vue
│  │  │  ├─ Header.vue
│  │  │  ├─ ScrollToTop.vue
```
##### 5.1 สร้างโฟลเดอร์ `app/components/App` และไฟล์ 
- `app/components/App/Header.vue`
- `app/components/App/Footer.vue`, 
- `app/components/App/ScrollToTop.vue`

##### 5.2 เพิ่มโค้ดในไฟล์ `app/components/App/Header.vue`
```vue
<script setup lang="ts">

// ตัวแปรสำหรับลิงก์การนำทาง
const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How it works', href: '#how-it-works' },
  { name: 'Community', href: '#community' },
  { name: 'Testimonials', href: '#testimonials' },
]

// สำหรับเลื่อนหน้าไปยังส่วนที่ต้องการอย่างนุ่มนวล
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
}

// สำหรับเลื่อนหน้าไปยังด้านบนเมื่อคลิกโลโก้
const scrollToTop = (e: Event) => {
  e.preventDefault()
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
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
        >
          <Icon name="i-heroicons-sparkles" class="w-8 h-8 text-primary" />
          <span class="text-xl font-bold bg-linear-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent">
            DreamBuddy
          </span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a 
            v-for="link in navLinks" 
            :key="link.name"
            :href="link.href"
            @click="scrollToSection($event, link.href)"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors cursor-pointer"
          >
            {{ link.name }}
          </a>
        </div>

        <!-- CTA Buttons -->
        <div class="flex items-center space-x-4">
          
          <UButton variant="ghost" size="md" class="hidden sm:inline-flex cursor-pointer">
            Sign In
          </UButton>
          <UButton size="md" color="primary" class="cursor-pointer">
            Start Free
          </UButton>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
</style>
```

##### 5.3 เพิ่มโค้ดในไฟล์ `app/components/App/Footer.vue`
```vue
<script setup lang="ts">

// ตัวแปรสำหรับปีปัจจุบัน
const currentYear = new Date().getFullYear()

// ลิงก์สำหรับส่วนต่าง ๆ ของ Footer
const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#' },
    { name: 'FAQ', href: '#' }
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' }
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Licenses', href: '#' }
  ],
  social: [
    { name: 'Twitter', icon: 'i-heroicons-link', href: '#' },
    { name: 'Facebook', icon: 'i-heroicons-link', href: '#' },
    { name: 'Instagram', icon: 'i-heroicons-link', href: '#' },
    { name: 'GitHub', icon: 'i-heroicons-link', href: '#' }
  ]
}
</script>

<template>
  <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
        <!-- Brand Column -->
        <div class="col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <Icon name="i-heroicons-sparkles" class="w-8 h-8 text-primary-500" />
            <span class="text-xl font-bold bg-linear-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
              DreamBuddy
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
            Turn your dreams into reality with smart savings tracking and community support.
          </p>
          <!-- Social Links -->
          <div class="flex space-x-3">
            <a 
              v-for="social in footerLinks.social" 
              :key="social.name"
              :href="social.href"
              class="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-primary-500 dark:hover:bg-primary-500 flex items-center justify-center transition-colors group"
              :aria-label="social.name"
            >
              <Icon :name="social.icon" class="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white" />
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.product" :key="link.name">
              <a 
                :href="link.href"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.company" :key="link.name">
              <a 
                :href="link.href"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal Links -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.legal" :key="link.name">
              <a 
                :href="link.href"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="col-span-2 md:col-span-4 lg:col-span-1">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Newsletter</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Get savings tips & updates
          </p>
          <div class="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email"
              class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <UButton size="sm" color="primary" class="cursor-pointer">
              <Icon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </UButton>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-gray-200 dark:border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            © {{ currentYear }} DreamBuddy. All rights reserved.
          </p>
          <div class="flex items-center space-x-6">
            <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
</style>
```

##### 5.4 เพิ่มโค้ดในไฟล์ `app/components/App/ScrollToTop.vue`
```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const checkScroll = () => {
  isVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <button
      v-show="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Scroll to top"
    >
      <Icon 
        name="i-heroicons-arrow-up" 
        class="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" 
      />
      
      <!-- Pulse ring effect -->
      <span class="absolute inset-0 rounded-full bg-primary-400 dark:bg-primary-300 opacity-20"></span>
    </button>
  </Transition>
</template>

<style scoped>
/* Additional hover effect */
button:active {
  transform: scale(0.95);
}
</style>
```

## 6: Create Component for Landing
```
dreambuddy/
├─ app/
│  ├─ components/
│  │  ├─ Landing/
│  │  │  ├─ Hero.vue
│  │  │  ├─ Feature.vue
│  │  │  ├─ Howitwork.vue
│  │  │  ├─ Comunity.vue
│  │  │  ├─ Testimonials.vue
│  │  │  ├─ CTA.vue
```

##### 6.1 สร้างโฟลเดอร์  `app/components/Landing` และไฟล์ 
- `app/components/Landing/Hero.vue`
- `app/components/Landing/Feature.vue`
- `app/components/Landing/Howitwork.vue`
- `app/components/Landing/Comunity.vue`
- `app/components/Landing/Testimonials.vue`
- `app/components/Landing/CTA.vue`

##### 6.2 เพิ่มโค้ดในไฟล์ `app/components/Landing/Hero.vue`
```vue
<script setup lang="ts">
const stats = [
  { value: '10,000+', label: 'Active Users' },
  { value: '50,000+', label: 'Goals Created' },
  { value: '₿1M+', label: 'Savings Achieved' },
]
</script>

<template>
  <section class="relative overflow-hidden bg-linear-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 sm:py-32">
    <!-- Background decoration -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Column - Content -->
        <div class="text-center lg:text-left space-y-8">
          <!-- Badge -->
          <div class="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <Icon name="i-heroicons-sparkles" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span class="text-sm font-medium text-primary-700 dark:text-primary-300">
              #1 Savings Goal Tracker
            </span>
          </div>

          <!-- Headline -->
          <div class="space-y-4">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Turn Your Dreams
              <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Into Reality
              </span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Set savings goals, track progress automatically, and share your journey with the community. 
              Make your financial dreams come true with DreamBuddy.
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <UButton size="xl" color="primary" class="px-4 cursor-pointer">
              <Icon name="i-heroicons-rocket-launch" class="w-5 h-5" />
              Start Free
            </UButton>
            <UButton size="xl" variant="outline" color="neutral" class="px-4 cursor-pointer">
              <Icon name="i-heroicons-play-circle" class="w-5 h-5" />
              See Demo
            </UButton>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div v-for="stat in stats" :key="stat.label" class="text-center lg:text-left">
              <div class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {{ stat.value }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Mockup -->
        <div class="relative">
          <!-- Goal Card Mockup -->
          <div class="relative z-10 mx-auto max-w-md lg:max-w-lg">
            <UCard class="shadow-2xl">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                      <Icon name="i-heroicons-home" class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">Dream House</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">by @johndoe</p>
                    </div>
                  </div>
                  <UBadge color="primary" variant="subtle">Public</UBadge>
                </div>
              </template>

              <div class="space-y-4">
                <!-- Progress Bar -->
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    <span class="text-sm font-bold text-primary-600 dark:text-primary-400">65%</span>
                  </div>
                  <UProgress :value="65" size="md" />
                </div>

                <!-- Amount -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">$65,000</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Goal</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">$100,000</p>
                  </div>
                </div>

                <!-- Daily Savings -->
                <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">Daily target</span>
                    <span class="text-sm font-semibold text-primary-700 dark:text-primary-300">$95.89/day</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                  <UButton block variant="soft" class="cursor-pointer">
                    <Icon name="i-heroicons-plus" class="w-4 h-4 mr-1" />
                    Add Savings
                  </UButton>
                  <UButton color="neutral" variant="outline" square class="cursor-pointer">
                    <Icon name="i-heroicons-heart" class="w-4 h-4" />
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Floating Elements -->
          <div class="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
          <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-400 rounded-full opacity-20 blur-xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 6.3 เพิ่มโค้ดในไฟล์ `app/components/Landing/Feature.vue`
```vue
<script setup lang="ts">
const features = [
  {
    icon: 'i-heroicons-flag',
    title: 'Unlimited Goals',
    description: 'Create as many savings goals as you want. No limits, no restrictions.',
    color: 'primary'
  },
  {
    icon: 'i-heroicons-calculator',
    title: 'Auto Calculate',
    description: 'Automatically calculate daily, weekly, or monthly savings needed.',
    color: 'success'
  },
  {
    icon: 'i-heroicons-chart-bar',
    title: 'Beautiful Dashboard',
    description: 'Track all your progress with an intuitive and beautiful interface.',
    color: 'warning'
  },
  {
    icon: 'i-heroicons-share',
    title: 'Share Publicly',
    description: 'Inspire others by sharing your goals or keep them private.',
    color: 'error'
  }
]
</script>

<template>
  <section id="features" class="py-20 sm:py-32 bg-white dark:bg-gray-950">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <UBadge color="primary" variant="subtle" size="lg" class="mb-4">
          Features
        </UBadge>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          Everything You Need to
          <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Achieve Your Goals
          </span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Powerful features designed to help you save smarter and reach your dreams faster.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="relative group"
        >
          <UCard class="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="space-y-4">
              <!-- Icon -->
              <div 
                class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                :class="{
                  'bg-primary-100 dark:bg-primary-900/30': feature.color === 'primary',
                  'bg-success-100 dark:bg-success-900/30': feature.color === 'success',
                  'bg-warning-100 dark:bg-warning-900/30': feature.color === 'warning',
                  'bg-error-100 dark:bg-error-900/30': feature.color === 'error',
                }"
              >
                <Icon 
                  :name="feature.icon" 
                  class="w-7 h-7"
                  :class="{
                    'text-primary-600 dark:text-primary-400': feature.color === 'primary',
                    'text-success-600 dark:text-success-400': feature.color === 'success',
                    'text-warning-600 dark:text-warning-400': feature.color === 'warning',
                    'text-error-600 dark:text-error-400': feature.color === 'error',
                  }"
                />
              </div>

              <!-- Content -->
              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {{ feature.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-16 text-center">
        <UCard class="max-w-4xl mx-auto bg-linear-to-r from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 border-primary-200 dark:border-primary-800">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex-1 text-left">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to start saving smarter?
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Join thousands of users who are already achieving their financial goals.
              </p>
            </div>
            <UButton size="lg" color="primary" class="whitespace-nowrap px-4 cursor-pointer">
              Get Started Free
              <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 6.4 เพิ่มโค้ดในไฟล์ `app/components/Landing/Howitwork.vue`
```vue
<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Set Your Goal',
    description: 'Create a savings goal with your target amount and deadline. Add a name and choose to make it public or private.',
    icon: 'i-heroicons-flag',
    color: 'secondary'
  },
  {
    number: '02',
    title: 'Track Your Progress',
    description: 'Log your savings regularly. Our system automatically calculates how much you need to save daily to reach your target.',
    icon: 'i-heroicons-chart-bar-square',
    color: 'success'
  },
  {
    number: '03',
    title: 'Share or Keep Private',
    description: 'Choose to share your goals publicly to inspire others, or keep them private for personal tracking for some people only.',
    icon: 'i-heroicons-users',
    color: 'warning'
  },
  {
    number: '04',
    title: 'Celebrate Success',
    description: 'When you reach your goal, celebrate your achievement! Get badges and share your success with the large community.',
    icon: 'i-heroicons-trophy',
    color: 'error'
  }
]
</script>

<template>
  <section id="how-it-works" class="py-20 sm:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <UBadge color="primary" variant="subtle" size="lg" class="mb-4">
          How It Works
        </UBadge>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          Simple Steps to
          <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Reach Your Dreams
          </span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Start saving smarter in just 4 easy steps.
        </p>
      </div>

      <!-- Steps -->
      <div class="relative max-w-6xl mx-auto">
        <!-- Connection Line (Desktop) -->
        <div class="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-primary-200 via-purple-200 to-primary-200 dark:from-primary-900 dark:via-purple-900 dark:to-primary-900 -translate-y-1/2"></div>

        <!-- Steps Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="relative"
          >
            <div class="relative z-10">
              <!-- Number Badge -->
              <div class="flex justify-center mb-6">
                <div 
                  class="relative w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl shadow-lg"
                  :class="{
                    'bg-secondary-500 text-white': step.color === 'secondary',
                    'bg-success-500 text-white': step.color === 'success',
                    'bg-warning-500 text-white': step.color === 'warning',
                    'bg-error-500 text-white': step.color === 'error',
                  }"
                >
                  {{ step.number }}
                </div>
              </div>

              <!-- Content Card -->
              <UCard class="text-center h-full">
                <div class="space-y-4">
                  <!-- Icon -->
                  <div class="flex justify-center">
                    <div 
                      class="w-14 h-14 rounded-xl flex items-center justify-center"
                      :class="{
                        'bg-secondary-100 dark:bg-secondary-900/30': step.color === 'secondary',
                        'bg-success-100 dark:bg-success-900/30': step.color === 'success',
                        'bg-warning-100 dark:bg-warning-900/30': step.color === 'warning',
                        'bg-error-100 dark:bg-error-900/30': step.color === 'error',
                      }"
                    >
                      <Icon 
                        :name="step.icon" 
                        class="w-7 h-7"
                        :class="{
                          'text-secondary-600 dark:text-secondary-400': step.color === 'secondary',
                          'text-success-600 dark:text-success-400': step.color === 'success',
                          'text-warning-600 dark:text-warning-400': step.color === 'warning',
                          'text-error-600 dark:text-error-400': step.color === 'error',
                        }"
                      />
                    </div>
                  </div>

                  <!-- Title & Description -->
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {{ step.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ step.description }}
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-16">
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Ready to start your journey?
        </p>
        <UButton size="xl" color="primary" class="shadow-lg shadow-primary-500/50 px-4 cursor-pointer">
          <Icon name="i-heroicons-rocket-launch" class="w-5 h-5" />
          Create Your First Goal
        </UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 6.5 เพิ่มโค้ดในไฟล์ `app/components/Landing/Comunity.vue`
```vue
<script setup lang="ts">
const communityGoals = [
  {
    id: 1,
    title: 'Dream House',
    author: 'Sarah Johnson',
    avatar: '👩',
    icon: 'i-heroicons-home',
    iconColor: 'primary',
    progress: 65,
    saved: 65000,
    target: 100000,
    likes: 234
  },
  {
    id: 2,
    title: 'World Travel',
    author: 'Mike Chen',
    avatar: '👨',
    icon: 'i-heroicons-globe-alt',
    iconColor: 'success',
    progress: 42,
    saved: 8400,
    target: 20000,
    likes: 189
  },
  {
    id: 3,
    title: 'New Car',
    author: 'Emma Davis',
    avatar: '👧',
    icon: 'i-heroicons-truck',
    iconColor: 'warning',
    progress: 78,
    saved: 31200,
    target: 40000,
    likes: 156
  },
  {
    id: 4,
    title: 'Wedding',
    author: 'Alex Brown',
    avatar: '🧑',
    icon: 'i-heroicons-heart',
    iconColor: 'error',
    progress: 55,
    saved: 16500,
    target: 30000,
    likes: 312
  },
  {
    id: 5,
    title: 'Education Fund',
    author: 'Lisa Wang',
    avatar: '👩‍🎓',
    icon: 'i-heroicons-academic-cap',
    iconColor: 'primary',
    progress: 88,
    saved: 44000,
    target: 50000,
    likes: 267
  },
  {
    id: 6,
    title: 'Emergency Fund',
    author: 'Tom Wilson',
    avatar: '👨‍💼',
    icon: 'i-heroicons-shield-check',
    iconColor: 'success',
    progress: 92,
    saved: 9200,
    target: 10000,
    likes: 445
  },
  {
    id: 7,
    title: 'Business Startup',
    author: 'Nina Patel',
    avatar: '👩‍💻',
    icon: 'i-heroicons-building-office',
    iconColor: 'warning',
    progress: 35,
    saved: 17500,
    target: 50000,
    likes: 198
  },
  {
    id: 8,
    title: 'Dream Vacation',
    author: 'Chris Lee',
    avatar: '🧑‍✈️',
    icon: 'i-heroicons-paper-airplane',
    iconColor: 'error',
    progress: 70,
    saved: 7000,
    target: 10000,
    likes: 223
  }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<template>
  <section id="community" class="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <UBadge color="primary" variant="subtle" size="lg" class="mb-4">
          Community
        </UBadge>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          Get Inspired by
          <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Others' Success
          </span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          See what goals people are working towards and get motivated to achieve yours.
        </p>
      </div>

      <!-- Goals Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div 
          v-for="goal in communityGoals" 
          :key="goal.id"
          class="group"
        >
          <UCard class="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <div class="text-2xl">{{ goal.avatar }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  @{{ goal.author.toLowerCase().replace(' ', '') }}
                </div>
              </div>
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="{
                  'bg-primary-100 dark:bg-primary-900/30': goal.iconColor === 'primary',
                  'bg-success-100 dark:bg-success-900/30': goal.iconColor === 'success',
                  'bg-warning-100 dark:bg-warning-900/30': goal.iconColor === 'warning',
                  'bg-error-100 dark:bg-error-900/30': goal.iconColor === 'error',
                }"
              >
                <Icon 
                  :name="goal.icon" 
                  class="w-5 h-5"
                  :class="{
                    'text-primary-600': goal.iconColor === 'primary',
                    'text-success-600': goal.iconColor === 'success',
                    'text-warning-600': goal.iconColor === 'warning',
                    'text-error-600': goal.iconColor === 'error',
                  }"
                />
              </div>
            </div>

            <!-- Title -->
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              {{ goal.title }}
            </h3>

            <!-- Progress -->
            <div class="mb-3">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-600 dark:text-gray-400">Progress</span>
                <span class="font-semibold text-primary-600 dark:text-primary-400">
                  {{ goal.progress }}%
                </span>
              </div>
              <UProgress v-model="goal.progress" size="sm" />
            </div>

            <!-- Amount -->
            <div class="flex justify-between text-sm mb-4">
              <div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Saved</div>
                <div class="font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(goal.saved) }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-500 dark:text-gray-400">Goal</div>
                <div class="font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(goal.target) }}
                </div>
              </div>
            </div>

            <!-- Likes -->
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Icon name="i-heroicons-heart-solid" class="w-4 h-4 text-error-500 mr-1" />
              <span>{{ goal.likes }} likes</span>
            </div>
          </UCard>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <UButton size="lg" variant="outline" class="px-4 cursor-pointer">
          Explore All Goals
          <Icon name="i-heroicons-arrow-right" class="w-5 h-5" />
        </UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 6.6 เพิ่มโค้ดในไฟล์ `app/components/Landing/Testimonials.vue`
```vue
<script setup lang="ts">
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Entrepreneur',
    avatar: '👩‍💼',
    rating: 5,
    comment: 'DreamBuddy helped me save $50,000 for my business startup in just 18 months! The daily savings calculator kept me on track, and sharing my progress publicly motivated me to stay consistent.',
    goal: 'Business Startup',
    achieved: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Software Developer',
    avatar: '👨‍💻',
    rating: 5,
    comment: 'I love how simple and intuitive the app is. I\'ve been tracking 3 different goals simultaneously - emergency fund, vacation, and a new laptop. Already achieved 2 of them and counting for more!',
    goal: 'Emergency Fund + More',
    achieved: true
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Teacher',
    avatar: '👩‍🏫',
    rating: 5,
    comment: 'The community feature is amazing! Seeing others achieve their goals inspired me to start my own. I\'m halfway to my dream car now and feeling more motivated than ever thanks to DreamBuddy.',
    goal: 'Dream Car',
    achieved: false
  }
]
</script>

<template>
  <section id="testimonials" class="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <UBadge color="primary" variant="subtle" size="lg" class="mb-4">
          Testimonials
        </UBadge>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          What Our Users
          <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Are Saying
          </span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Join thousands of happy users who achieved their financial goals with DreamBuddy.
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          class="group"
        >
          <UCard class="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="space-y-4">
              <!-- Rating -->
              <div class="flex items-center space-x-1">
                <Icon 
                  v-for="i in testimonial.rating" 
                  :key="i"
                  name="i-heroicons-star-solid" 
                  class="w-5 h-5 text-warning-400"
                />
              </div>

              <!-- Comment -->
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                "{{ testimonial.comment }}"
              </p>

              <!-- Goal Badge -->
              <div class="flex items-center space-x-2">
                <UBadge 
                  :color="testimonial.achieved ? 'success' : 'primary'" 
                  variant="subtle"
                >
                  {{ testimonial.goal }}
                </UBadge>
                <Icon 
                  v-if="testimonial.achieved"
                  name="i-heroicons-check-badge-solid" 
                  class="w-5 h-5 text-success-500"
                />
              </div>

              <!-- Author -->
              <div class="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div class="text-3xl">{{ testimonial.avatar }}</div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">
                    {{ testimonial.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ testimonial.role }}
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            4.9/5
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Average Rating
          </div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            10,000+
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Happy Users
          </div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            85%
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Success Rate
          </div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            $10M+
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Total Saved
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 6.7 เพิ่มโค้ดในไฟล์ `app/components/Landing/CTA.vue`
```vue
<script setup lang="ts">
const benefits = [
  'Free forever - no credit card required',
  'Unlimited savings goals',
  'Beautiful progress tracking',
  'Community support & inspiration'
]
</script>

<template>
  <section class="py-20 sm:py-32 bg-linear-to-br from-primary-600 via-blue-600 to-primary-700 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="max-w-4xl mx-auto">
        <!-- Main Content -->
        <div class="text-center mb-12">
          <!-- Icon -->
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Icon name="i-heroicons-sparkles" class="w-10 h-10 text-white" />
          </div>

          <!-- Headline -->
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Start Building Your First
            <span class="block">Savings Goal Today!</span>
          </h2>

          <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already turning their dreams into reality with DreamBuddy.
          </p>

          <!-- Benefits List -->
          <div class="grid sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
            <div 
              v-for="(benefit, index) in benefits" 
              :key="index"
              class="flex items-center space-x-3 text-left bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
            >
              <Icon name="i-heroicons-check-circle-solid" class="w-6 h-6 text-success-300 shrink-0" />
              <span class="text-white font-medium">{{ benefit }}</span>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <UButton 
              size="xl" 
              color="primary" 
              class="shadow-lg shadow-primary-500/50 px-4 cursor-pointer"
            >
              <Icon name="i-heroicons-rocket-launch" class="w-5 h-5" />
              Get Started Free
            </UButton>
            <UButton 
              size="xl" 
              variant="outline"
              color="neutral"
              class="px-4 cursor-pointer"
            >
              <Icon name="i-heroicons-play-circle" class="w-5 h-5" />
              See Demo
            </UButton>
          </div>

          <!-- Social Proof -->
          <div class="mt-10 pt-10 border-t border-white/20">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div class="flex items-center space-x-2">
                <div class="flex -space-x-2">
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border-2 border-white/50">👨</div>
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border-2 border-white/50">👩</div>
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border-2 border-white/50">🧑</div>
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border-2 border-white/50">👧</div>
                </div>
                <div class="text-left">
                  <div class="text-white font-semibold">10,000+ Users</div>
                  <div class="text-white/80 text-sm">Already saving smarter</div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <div class="flex">
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                </div>
                <div class="text-left">
                  <div class="text-white font-semibold">4.9/5 Rating</div>
                  <div class="text-white/80 text-sm">From happy users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```


## 7: Create Landing Page

##### 7.1 แก้ไขโค้ดในไฟล์ `app/pages/index.vue`
```vue
<script setup lang="ts">
useHead({
  title: 'DreamBuddy - Turn Your Dreams Into Reality',
  meta: [
    { 
      name: 'description', 
      content: 'Track your savings goals, share with the community, and turn your dreams into reality. Join thousands of users saving smarter with DreamBuddy.' 
    }
  ]
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <LandingHero />

    <!-- Feature Section -->
    <LandingFeature />

    <!-- How It Works Section -->
    <LandingHowitwork />
    
    <!-- Community Section -->
    <LandingComunity />

    <!-- Testimonials Section -->
    <LandingTestimonials />

    <!-- CTA Section -->
    <LandingCTA />
  </div>
</template>

<style lang="css" scoped>
</style>
```

## 8: Create Layout
##### 8.1 สร้างโฟลเดอร์ `app/layouts` และไฟล์ `app/layouts/default.vue`
```
dreambuddy/
├─ app/
│  ├─ layouts/
│  │  ├─ default.vue
│  ├─ app.vue
```

##### 8.2 เพิ่มโค้ดในไฟล์ `app/layouts/default.vue`
```vue
<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    
    <!-- Scroll to Top Button -->
    <AppScrollToTop />
  </div>
</template>
```

##### 8.3 แก้ไขโค้ดในไฟล์ `app/app.vue`
```vue
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

## 9: Setup Google Fonts
```
dreambuddy/
├─ app/
│  ├─ assets/
│  │  ├─ css/
│  │  │  ├─ main.css
```

##### 9.1 ติดตั้งแพ็กเกจ `@nuxtjs/google-fonts`
```bash
bun add @nuxtjs/google-fonts
```

##### 9.2 แก้ไขโค้ดในไฟล์ `app/assets/css/main.css`
```css
@import "tailwindcss";
@import "@nuxt/ui";

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: 'Inter', 'Anuphan', sans-serif;
  }
}
```

##### 9.3 แก้ไขไฟล์ `nuxt.config.ts` เพื่อเพิ่ม Google Fonts
```ts
export default defineNuxtConfig({
  modules: [
    ['@nuxtjs/google-fonts', {
      families: {
        Inter: '200..700',
        Anuphan: ['400', '500'],
      },
      display: 'swap', // ใช้ค่า display เป็น swap สำหรับประสิทธิภาพที่ดีขึ้น
      preload: true, // เปิดใช้งาน preload เพือประสิทธิภาพที่ดีขึ้น
      prefetch: true, // เปิดใช้งาน prefetch เพื่อประสิทธิภาพที่ดีขึ้น
      preconnect: true, // เปิดใช้งาน preconnect เพื่อประสิทธิภาพที่ดีขึ้น
      download: true, // ดาวน์โหลดฟอนต์ไปยังโครงการของคุณ
      inject: true, // ฝังฟอนต์ใน CSS ของคุณ
    }]
  ]
})
```

##### 9.5 รันโปรเจกต์
```bash
bun run dev
```

> ทำการ commit และ checkout new branch
  git add .
  git commit -m "Setup Google Fonts Complete"
  git checkout -b dev-darkmode

## 10: Setup Dark Mode
```
dreambuddy/
├─ app/
│  ├─ components/
│  │  ├─ App/
│  │  │  ├─ Header.vue
│  │  │  ├─ ThemeToggle.vue
```

##### 10.1 สร้างไฟล์ `app/components/App/ThemeToggle.vue` สำหรับสลับโหมดสี
```vue
<script setup lang="ts">
// สร้างตัวแปรและฟังก์ชันสำหรับการสลับธีม (ธีมมืด/สว่าง)
// useColorMode มาจาก Nuxt UI เพื่อจัดการโหมดสีของแอป
const colorMode = useColorMode()

// คอมพิวเต็ดพร็อพเพอร์ตี้เพื่อตรวจสอบและตั้งค่าธีมปัจจุบัน
const isDark = computed({
  // กำหนด getter และ setter สำหรับ isDark
  get() {
    return colorMode.value === 'dark'
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})


// ฟังก์ชันสำหรับสลับธีม
const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<template>
  <button 
    @click="toggleTheme"
    class="relative w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 group cursor-pointer"
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    aria-label="Toggle theme"
  >
    <!-- Sun Icon (Light Mode) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 rotate-90 scale-50"
      enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 -rotate-90 scale-50"
    >
      <Icon 
        v-if="!isDark"
        name="i-heroicons-sun" 
        class="absolute w-5 h-5 text-yellow-600 dark:text-yellow-500 group-hover:text-yellow-700 dark:group-hover:text-yellow-400"
      />
    </Transition>
    
    <!-- Moon Icon (Dark Mode) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -rotate-90 scale-50"
      enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 rotate-90 scale-50"
    >
      <Icon 
        v-if="isDark"
        name="i-heroicons-moon" 
        class="absolute w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300"
      />
    </Transition>
  </button>
</template>

<style scoped>
/* Smooth hover effects */
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Icon glow effect on hover */
button:hover .absolute {
  filter: drop-shadow(0 0 8px currentColor);
}
</style>
```

##### 10.2 แก้ไขโค้ดในไฟล์ `app/components/App/Header.vue` เพื่อเพิ่มปุ่มสลับโหมดสี
```vue
<script setup lang="ts">

// ตัวแปรสำหรับลิงก์การนำทาง
const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How it works', href: '#how-it-works' },
  { name: 'Community', href: '#community' },
  { name: 'Testimonials', href: '#testimonials' },
]

// ฟังก์ชันสำหรับเลื่อนหน้าไปยังส่วนที่ต้องการอย่างนุ่มนวล
const scrollToSection = (e: Event, href: string) => {
  e.preventDefault()
  const targetId = href.substring(1) // Remove '#'
  const targetElement = document.getElementById(targetId)
  
  if (targetElement) {
    const headerOffset = 80 // Height of sticky header + some padding
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// ฟังก์ชันสำหรับเลื่อนหน้าไปยังด้านบนเมื่อคลิกโลโก้
const scrollToTop = (e: Event) => {
  e.preventDefault()
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
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
        >
          <Icon name="i-heroicons-sparkles" class="w-8 h-8 text-primary" />
          <span class="text-xl font-bold bg-linear-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent">
            DreamBuddy
          </span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a 
            v-for="link in navLinks" 
            :key="link.name"
            :href="link.href"
            @click="scrollToSection($event, link.href)"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors cursor-pointer"
          >
            {{ link.name }}
          </a>
        </div>

        <!-- CTA Buttons -->
        <div class="flex items-center space-x-4">
          
          <!-- Theme Toggle -->
          <AppThemeToggle />
          
          <UButton variant="ghost" size="md" class="hidden sm:inline-flex cursor-pointer">
            Sign In
          </UButton>
          <UButton size="md" color="primary" class="cursor-pointer">
            Start Free
          </UButton>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
</style>
```

##### 10.3 ทดสอบโหมดสีโดยรันโปรเจกต์
```bash
bun run dev
```

> ทำการ commit และ checkout new branch
  git add .
  git commit -m "Setup Dark Mode Complete"
  git checkout -b dev-i18n

## 11: Setup i18n

> เป้าหมาย: เพิ่มการรองรับหลายภาษา (อังกฤษ, ไทย, ญี่ปุ่น, ลาว) ในแอป DreamBuddy

```
dreambuddy/
├─ app/
│  ├─ components/
│  │  ├─ App/
│  │  │  ├─ Header.vue
│  │  │  ├─ LanguageSwitcher.vue
│  ├─ locals/
│  │  ├─ en.json
│  │  ├─ th.json
│  │  ├─ jp.json
│  │  ├─ la.json
├─ nuxt.config.ts
```

##### 11.1 ติดตั้งแพ็กเกจ `nuxt-i18n-micro`
```bash
bun add nuxt-i18n-micro
```

##### 11.2 แก้ไขโค้ดในไฟล์ `nuxt.config.ts` เพื่อเพิ่ม i18n
```ts
export default defineNuxtConfig({
  modules: [
    ['nuxt-i18n-micro', {
      locales: [
        { code: 'en', iso: 'en-US', name: 'English', dir: 'ltr' },
        { code: 'th', iso: 'th-TH', name: 'ไทย', dir: 'ltr' },
        { code: 'jp', iso: 'jp-JP', name: '日本語', dir: 'ltr' },
        { code: 'la', iso: 'lo-LA', name: 'ລາວ', dir: 'ltr' }
      ],
      defaultLocale: 'en', // ตั้งค่าภาษาเริ่มต้นเป็นอังกฤษ
      translationDir: 'app/locales', // โฟลเดอร์ที่เก็บไฟล์แปลภาษา
      meta: true, // เปิดใช้งานการจัดการ meta tags สำหรับ SEO
      autoDetectLanguage: false, // ปิดการตรวจจับภาษาของเบราว์เซอร์
      includeDefaultLocaleRoute: false, // ไม่รวมรหัสภาษาสำหรับภาษาเริ่มต้นใน URL
      types: 'all', // สร้างไทป์สำหรับทุกภาษา
      disablePageLocales: true, // ปิดการใช้งานการสร้างหน้าแยกตามภาษา
    }],
    // โมดูลอื่น ๆ ของคุณ
  ],
})
```

##### 11.3 สร้างโฟลเดอร์ `app/locales` และไฟล์แปลภาษา
```
dreambuddy/
├─ app/
│  ├─ locales/
│  │  ├─ en.json
│  │  ├─ th.json
│  │  ├─ jp.json
│  │  ├─ la.json
```
##### 11.4 เพิ่มโค้ดในไฟล์ `app/locales/en.json`
```json
{
  "nav": {
    "features": "Features",
    "howItWorks": "How it works",
    "community": "Community",
    "testimonials": "Testimonials",
    "signIn": "Sign In",
    "startFree": "Start Free"
  },
  "hero": {
    "badge": "#1 Savings Goal Tracker",
    "title": "Turn Your Dreams",
    "titleHighlight": "Into Reality",
    "subtitle": "Set savings goals, track progress automatically, and share your journey with the community. Make your financial dreams come true with DreamBuddy.",
    "startFree": "Start Free",
    "seeDemo": "See Demo",
    "stats": {
      "activeUsers": "Active Users",
      "goalsCreated": "Goals Created",
      "savingsAchieved": "Savings Achieved"
    },
    "goalCard": {
      "dreamHouse": "Dream House",
      "by": "by",
      "public": "Public",
      "progress": "Progress",
      "saved": "Saved",
      "goal": "Goal",
      "dailyTarget": "Daily target",
      "addSavings": "Add Savings"
    }
  },
  "features": {
    "badge": "Features",
    "title": "Everything You Need to",
    "titleHighlight": "Achieve Your Goals",
    "subtitle": "Powerful features designed to help you save smarter and reach your dreams faster.",
    "items": {
      "unlimitedGoals": {
        "title": "Unlimited Goals",
        "description": "Create as many savings goals as you want. No limits, no restrictions."
      },
      "autoCalculate": {
        "title": "Auto Calculate",
        "description": "Automatically calculate daily, weekly, or monthly savings needed."
      },
      "beautifulDashboard": {
        "title": "Beautiful Dashboard",
        "description": "Track all your progress with an intuitive and beautiful interface."
      },
      "sharePublicly": {
        "title": "Share Publicly",
        "description": "Inspire others by sharing your goals or keep them private."
      }
    },
    "cta": {
      "title": "Ready to start saving smarter?",
      "subtitle": "Join thousands of users who are already achieving their financial goals.",
      "button": "Get Started Free"
    }
  },
  "community": {
    "badge": "Community",
    "title": "Get Inspired by",
    "titleHighlight": "Others' Success",
    "subtitle": "See what goals people are working towards and get motivated to achieve yours.",
    "progress": "Progress",
    "saved": "Saved",
    "goal": "Goal",
    "likes": "likes",
    "exploreAll": "Explore All Goals"
  },
  "howItWorks": {
    "badge": "How It Works",
    "title": "Simple Steps to",
    "titleHighlight": "Reach Your Dreams",
    "subtitle": "Start saving smarter in just 4 easy steps.",
    "steps": {
      "step1": {
        "title": "Set Your Goal",
        "description": "Create a savings goal with your target amount and deadline. Add a name and choose to make it public or private."
      },
      "step2": {
        "title": "Track Your Progress",
        "description": "Log your savings regularly. Our system automatically calculates how much you need to save daily to reach your target."
      },
      "step3": {
        "title": "Share or Keep Private",
        "description": "Choose to share your goals publicly to inspire others, or keep them private for personal tracking for some people only."
      },
      "step4": {
        "title": "Celebrate Success",
        "description": "When you reach your goal, celebrate your achievement! Get badges and share your success with the large community."
      }
    },
    "cta": {
      "question": "Ready to start your journey?",
      "button": "Create Your First Goal"
    }
  },
  "testimonials": {
    "badge": "Testimonials",
    "title": "What Our Users",
    "titleHighlight": "Are Saying",
    "subtitle": "Join thousands of happy users who achieved their financial goals with DreamBuddy.",
    "stats": {
      "rating": "Average Rating",
      "users": "Happy Users",
      "successRate": "Success Rate",
      "totalSaved": "Total Saved"
    }
  },
  "cta": {
    "icon": "✨",
    "title": "Start Building Your First",
    "titleLine2": "Savings Goal Today!",
    "subtitle": "Join thousands of users who are already turning their dreams into reality with DreamBuddy.",
    "benefits": {
      "free": "Free - no credit card required",
      "unlimited": "Unlimited savings goals",
      "tracking": "Beautiful progress tracking",
      "community": "Community support & inspiration"
    },
    "buttons": {
      "start": "Get Started Free",
      "demo": "Watch Demo"
    },
    "social": {
      "users": "Users",
      "subtitle": "Already saving smarter",
      "rating": "Rating",
      "ratingSubtitle": "From happy users"
    }
  },
  "footer": {
    "description": "Turn your dreams into reality with smart savings tracking and community support.",
    "product": "Product",
    "company": "Company",
    "legal": "Legal",
    "newsletter": {
      "title": "Newsletter",
      "subtitle": "Get savings tips & updates",
      "placeholder": "Your email"
    },
    "links": {
      "features": "Features",
      "howItWorks": "How it Works",
      "pricing": "Pricing",
      "faq": "FAQ",
      "about": "About",
      "blog": "Blog",
      "careers": "Careers",
      "contact": "Contact",
      "privacy": "Privacy",
      "terms": "Terms",
      "cookies": "Cookie Policy",
      "licenses": "Licenses"
    },
    "copyright": "DreamBuddy. All rights reserved.",
    "bottom": {
      "privacy": "Privacy Policy",
      "terms": "Terms of Service",
      "cookies": "Cookies"
    }
  },
  "auth": {
    "backToHome": "Back to Homepage",
    "leftPanel": {
      "title": "Start Your Savings Journey Today",
      "subtitle": "Join thousands of users who are making their dreams come true with DreamBuddy.",
      "stats": {
        "users": "Users",
        "goals": "Goals",
        "saved": "Saved"
      },
      "quote": "DreamBuddy helped me save for my dream house in just 2 years!",
      "quoteAuthor": "Happy DreamBuddy User"
    },
    "login": {
      "title": "Welcome Back",
      "subtitle": "Sign in to continue your savings journey",
      "continueWithGoogle": "Continue with Google",
      "continueWithGithub": "Continue with Github",
      "orContinueWith": "Or continue with email",
      "email": "Email address",
      "emailPlaceholder": "Enter your email",
      "password": "Password",
      "passwordPlaceholder": "Enter your password",
      "rememberMe": "Remember me",
      "forgotPassword": "Forgot password?",
      "signIn": "Sign in",
      "noAccount": "Don't have an account?",
      "signUp": "Sign up",
      "invalidEmail": "Invalid email address",
      "passwordTooShort": "Password must be at least 6 characters",
      "successTitle": "Success",
      "successMessage": "Logged in successfully",
      "errorTitle": "Error",
      "errorMessage": "Login failed"
    },
    "register": {
      "title": "Create Account",
      "subtitle": "Start saving for your dreams today",
      "continueWithGoogle": "Continue with Google",
      "continueWithGithub": "Continue with Github",
      "orRegisterWith": "Or register with email",
      "name": "Full name",
      "namePlaceholder": "Enter your name",
      "email": "Email address",
      "emailPlaceholder": "Enter your email",
      "password": "Password",
      "passwordPlaceholder": "Create a password",
      "confirmPassword": "Confirm password",
      "confirmPasswordPlaceholder": "Confirm your password",
      "agreeToTerms": "I agree to the",
      "termsOfService": "Terms of Service",
      "and": "and",
      "privacyPolicy": "Privacy Policy",
      "createAccount": "Create account",
      "haveAccount": "Already have an account?",
      "signIn": "Sign in",
      "nameRequired": "Name is required",
      "username": "Username",
      "usernamePlaceholder": "Enter your username",
      "usernameTooShort": "Username must be at least 3 characters",
      "mustAgreeTerms": "You must agree to the terms",
      "passwordsDoNotMatch": "Passwords do not match",
      "successMessage": "Account created successfully",
      "errorMessage": "Registration failed"
    },
    "forgotPassword": {
      "title": "Reset Password",
      "subtitle": "Enter your email address and we'll send you a link to reset your password",
      "email": "Email address",
      "emailPlaceholder": "Enter your email",
      "emailHint": "We'll send you a password reset link to this email",
      "sendResetLink": "Send reset link",
      "backToLogin": "Back to login",
      "checkEmail": "Check your email",
      "emailSent": "We sent a password reset link to",
      "instructions": "Click the link in the email to reset your password. If you don't see the email, check your spam folder.",
      "resendEmail": "Resend email"
    }
  }
}
```

##### 11.5 เพิ่มโค้ดในไฟล์ `app/locales/th.json`
```json
{
  "nav": {
    "features": "ฟีเจอร์",
    "howItWorks": "วิธีใช้งาน",
    "community": "ชุมชน",
    "testimonials": "รีวิว",
    "signIn": "เข้าสู่ระบบ",
    "startFree": "เริ่มใช้ฟรี"
  },
  "hero": {
    "badge": "#1 แอปติดตามเป้าหมายการออม",
    "title": "เปลี่ยนความฝัน",
    "titleHighlight": "ให้เป็นจริง",
    "subtitle": "ตั้งเป้าหมายการออม ติดตามความคืบหน้าอัตโนมัติ และแชร์เส้นทางของคุณกับชุมชน ทำให้ความฝันทางการเงินของคุณเป็นจริงด้วย DreamBuddy",
    "startFree": "เริ่มใช้ฟรี",
    "seeDemo": "ดูตัวอย่าง",
    "stats": {
      "activeUsers": "ผู้ใช้งาน",
      "goalsCreated": "เป้าหมายที่สร้าง",
      "savingsAchieved": "เงินออมที่ได้"
    },
    "goalCard": {
      "dreamHouse": "บ้านในฝัน",
      "by": "โดย",
      "public": "สาธารณะ",
      "progress": "ความคืบหน้า",
      "saved": "ออมแล้ว",
      "goal": "เป้าหมาย",
      "dailyTarget": "เป้าหมายรายวัน",
      "addSavings": "เพิ่มเงินออม"
    }
  },
  "features": {
    "badge": "ฟีเจอร์",
    "title": "ทุกสิ่งที่คุณต้องการ",
    "titleHighlight": "เพื่อบรรลุเป้าหมาย",
    "subtitle": "ฟีเจอร์ที่ทรงพลังออกแบบมาเพื่อช่วยให้คุณออมอย่างชาญฉลาดและบรรลุความฝันได้เร็วขึ้น",
    "items": {
      "unlimitedGoals": {
        "title": "เป้าหมายไม่จำกัด",
        "description": "สร้างเป้าหมายการออมได้ไม่จำกัด ไม่มีข้อจำกัด ไม่มีการจำกัด"
      },
      "autoCalculate": {
        "title": "คำนวณอัตโนมัติ",
        "description": "คำนวณการออมรายวัน รายสัปดาห์ หรือรายเดือนที่จำเป็นโดยอัตโนมัติ"
      },
      "beautifulDashboard": {
        "title": "แดชบอร์ดสวยงาม",
        "description": "ติดตามความคืบหน้าทั้งหมดของคุณด้วยอินเทอร์เฟซที่ใช้งานง่ายและสวยงาม"
      },
      "sharePublicly": {
        "title": "แชร์สู่สาธารณะ",
        "description": "สร้างแรงบันดาลใจให้ผู้อื่นด้วยการแชร์เป้าหมายของคุณ หรือเก็บเป็นความลับ"
      }
    },
    "cta": {
      "title": "พร้อมที่จะเริ่มออมอย่างชาญฉลาดแล้วหรือยัง?",
      "subtitle": "เข้าร่วมกับผู้ใช้หลายพันคนที่กำลังบรรลุเป้าหมายทางการเงินของพวกเขา",
      "button": "เริ่มใช้งานฟรี"
    }
  },
  "community": {
    "badge": "ชุมชน",
    "title": "รับแรงบันดาลใจจาก",
    "titleHighlight": "ความสำเร็จของผู้อื่น",
    "subtitle": "ดูเป้าหมายที่ผู้คนกำลังทำงานและรับแรงจูงใจในการบรรลุเป้าหมายของคุณ",
    "progress": "ความคืบหน้า",
    "saved": "ออมแล้ว",
    "goal": "เป้าหมาย",
    "likes": "ถูกใจ",
    "exploreAll": "สำรวจเป้าหมายทั้งหมด"
  },
  "howItWorks": {
    "badge": "วิธีใช้งาน",
    "title": "ขั้นตอนง่ายๆ ใน",
    "titleHighlight": "การบรรลุความฝัน",
    "subtitle": "เริ่มออมอย่างชาญฉลาดในเพียง 4 ขั้นตอนง่ายๆ",
    "steps": {
      "step1": {
        "title": "ตั้งเป้าหมาย",
        "description": "สร้างเป้าหมายการออมพร้อมจำนวนเป้าหมายและกำหนดเวลา เพิ่มชื่อและเลือกที่จะทำให้เป็นสาธารณะหรือส่วนตัว"
      },
      "step2": {
        "title": "ติดตามความคืบหน้า",
        "description": "บันทึกการออมของคุณเป็นประจำ ระบบของเราจะคำนวณจำนวนที่คุณต้องออมรายวันเพื่อให้ถึงเป้าหมายโดยอัตโนมัติ"
      },
      "step3": {
        "title": "แชร์หรือเก็บเป็นความลับ",
        "description": "เลือกแชร์เป้าหมายของคุณต่อสาธารณะเพื่อสร้างแรงบันดาลใจให้ผู้อื่น หรือเก็บเป็นความลับสำหรับการติดตามส่วนตัวเท่านั้น"
      },
      "step4": {
        "title": "ฉลองความสำเร็จ",
        "description": "เมื่อคุณถึงเป้าหมาย ฉลองความสำเร็จของคุณ! รับเหรียญตราและแชร์ความสำเร็จของคุณกับชุมชน 🎉"
      }
    },
    "cta": {
      "question": "พร้อมที่จะเริ่มต้นการเดินทางของคุณแล้วหรือยัง?",
      "button": "สร้างเป้าหมายแรกของคุณ"
    }
  },
  "testimonials": {
    "badge": "รีวิว",
    "title": "สิ่งที่ผู้ใช้ของเรา",
    "titleHighlight": "พูดถึงเรา",
    "subtitle": "เข้าร่วมกับผู้ใช้ที่มีความสุขหลายพันคนที่บรรลุเป้าหมายทางการเงินด้วย DreamBuddy",
    "stats": {
      "rating": "คะแนนเฉลี่ย",
      "users": "ผู้ใช้ที่มีความสุข",
      "successRate": "อัตราความสำเร็จ",
      "totalSaved": "ยอดออมทั้งหมด"
    }
  },
  "cta": {
    "icon": "✨",
    "title": "เริ่มสร้างเป้าหมาย",
    "titleLine2": "การออมแรกของคุณวันนี้!",
    "subtitle": "เข้าร่วมกับผู้ใช้หลายพันคนที่กำลังเปลี่ยนความฝันให้เป็นจริงด้วย DreamBuddy",
    "benefits": {
      "free": "ฟรีตลอดไป - ไม่ต้องใช้บัตรเครดิต",
      "unlimited": "เป้าหมายการออมไม่จำกัด",
      "tracking": "การติดตามความคืบหน้าที่สวยงาม",
      "community": "การสนับสนุนและแรงบันดาลใจจากชุมชน"
    },
    "buttons": {
      "start": "เริ่มใช้งานฟรี",
      "demo": "ดูสาธิต"
    },
    "social": {
      "users": "ผู้ใช้",
      "subtitle": "กำลังออมอย่างชาญฉลาด",
      "rating": "คะแนน",
      "ratingSubtitle": "จากผู้ใช้ที่มีความสุข"
    }
  },
  "footer": {
    "description": "เปลี่ยนความฝันของคุณให้เป็นจริงด้วยการติดตามการออมอย่างชาญฉลาดและการสนับสนุนจากชุมชน",
    "product": "ผลิตภัณฑ์",
    "company": "บริษัท",
    "legal": "กฎหมาย",
    "newsletter": {
      "title": "จดหมายข่าว",
      "subtitle": "รับเคล็ดลับการออมและอัปเดต",
      "placeholder": "อีเมลของคุณ"
    },
    "links": {
      "features": "ฟีเจอร์",
      "howItWorks": "วิธีใช้งาน",
      "pricing": "ราคา",
      "faq": "คำถามที่พบบ่อย",
      "about": "เกี่ยวกับ",
      "blog": "บล็อก",
      "careers": "อาชีพ",
      "contact": "ติดต่อ",
      "privacy": "ความเป็นส่วนตัว",
      "terms": "เงื่อนไข",
      "cookies": "นโยบายคุกกี้",
      "licenses": "ใบอนุญาต"
    },
    "copyright": "DreamBuddy สงวนลิขสิทธิ์",
    "bottom": {
      "privacy": "นโยบายความเป็นส่วนตัว",
      "terms": "เงื่อนไขการให้บริการ",
      "cookies": "คุกกี้"
    }
  },
  "auth": {
    "backToHome": "กลับไปหน้าหลัก",
    "leftPanel": {
      "title": "เริ่มต้นการออมเงินของคุณวันนี้",
      "subtitle": "เข้าร่วมกับผู้ใช้นับพันที่กำลังทำให้ความฝันเป็นจริงด้วย DreamBuddy",
      "stats": {
        "users": "ผู้ใช้",
        "goals": "เป้าหมาย",
        "saved": "ออมแล้ว"
      },
      "quote": "DreamBuddy ช่วยให้ฉันออมเงินซื้อบ้านในฝันได้ภายใน 2 ปี!",
      "quoteAuthor": "ผู้ใช้ DreamBuddy ที่มีความสุข"
    },
    "login": {
      "title": "ยินดีต้อนรับกลับ",
      "subtitle": "เข้าสู่ระบบเพื่อดำเนินการออมเงินต่อ",
      "continueWithGoogle": "ดำเนินการต่อด้วย Google",
      "continueWithGithub": "ดำเนินการต่อด้วย Github",
      "orContinueWith": "หรือดำเนินการต่อด้วยอีเมล",
      "email": "ที่อยู่อีเมล",
      "emailPlaceholder": "กรอกอีเมลของคุณ",
      "password": "รหัสผ่าน",
      "passwordPlaceholder": "กรอกรหัสผ่านของคุณ",
      "rememberMe": "จดจำฉัน",
      "forgotPassword": "ลืมรหัสผ่าน?",
      "signIn": "เข้าสู่ระบบ",
      "noAccount": "ยังไม่มีบัญชี?",
      "signUp": "สมัครสมาชิก",
      "invalidEmail": "ที่อยู่อีเมลไม่ถูกต้อง",
      "passwordTooShort": "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      "successTitle": "สำเร็จ",
      "successMessage": "เข้าสู่ระบบสำเร็จ",
      "errorTitle": "ข้อผิดพลาด",
      "errorMessage": "การเข้าสู่ระบบล้มเหลว"
    },
    "register": {
      "title": "สร้างบัญชี",
      "subtitle": "เริ่มออมเงินเพื่อความฝันของคุณวันนี้",
      "continueWithGoogle": "ดำเนินการต่อด้วย Google",
      "continueWithGithub": "ดำเนินการต่อด้วย Github",
      "orRegisterWith": "หรือสมัครด้วยอีเมล",
      "name": "ชื่อ-นามสกุล",
      "namePlaceholder": "กรอกชื่อของคุณ",
      "email": "ที่อยู่อีเมล",
      "emailPlaceholder": "กรอกอีเมลของคุณ",
      "password": "รหัสผ่าน",
      "passwordPlaceholder": "สร้างรหัสผ่าน",
      "confirmPassword": "ยืนยันรหัสผ่าน",
      "confirmPasswordPlaceholder": "ยืนยันรหัสผ่านของคุณ",
      "agreeToTerms": "ฉันยอมรับ",
      "termsOfService": "เงื่อนไขการให้บริการ",
      "and": "และ",
      "privacyPolicy": "นโยบายความเป็นส่วนตัว",
      "createAccount": "สร้างบัญชี",
      "haveAccount": "มีบัญชีอยู่แล้ว?",
      "signIn": "เข้าสู่ระบบ",
      "nameRequired": "กรุณาระบุชื่อ",
      "username": "ชื่อผู้ใช้",
      "usernamePlaceholder": "กรอกชื่อผู้ใช้ของคุณ",
      "usernameTooShort": "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร",
      "mustAgreeTerms": "คุณต้องยอมรับเงื่อนไข",
      "passwordsDoNotMatch": "รหัสผ่านไม่ตรงกัน",
      "successMessage": "สร้างบัญชีสำเร็จแล้ว",
      "errorMessage": "การลงทะเบียนล้มเหลว"
    },
    "forgotPassword": {
      "title": "รีเซ็ตรหัสผ่าน",
      "subtitle": "กรอกที่อยู่อีเมลของคุณ แล้วเราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ",
      "email": "ที่อยู่อีเมล",
      "emailPlaceholder": "กรอกอีเมลของคุณ",
      "emailHint": "เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลนี้",
      "sendResetLink": "ส่งลิงก์รีเซ็ต",
      "backToLogin": "กลับไปหน้าเข้าสู่ระบบ",
      "checkEmail": "ตรวจสอบอีเมลของคุณ",
      "emailSent": "เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง",
      "instructions": "คลิกลิงก์ในอีเมลเพื่อรีเซ็ตรหัสผ่านของคุณ หากคุณไม่เห็นอีเมล ให้ตรวจสอบในโฟลเดอร์สแปม",
      "resendEmail": "ส่งอีเมลอีกครั้ง"
    }
  }
}
```

##### 11.6 เพิ่มโค้ดในไฟล์ `app/locales/jp.json`
```json
{
  "nav": {
    "features": "機能",
    "howItWorks": "使い方",
    "community": "コミュニティ",
    "testimonials": "お客様の声",
    "signIn": "ログイン",
    "startFree": "無料で始める"
  },
  "hero": {
    "badge": "#1 貯金目標トラッカー",
    "title": "あなたの夢を",
    "titleHighlight": "現実に",
    "subtitle": "貯金目標を設定し、進捗を自動的に追跡し、コミュニティとあなたの旅を共有しましょう。DreamBuddyであなたの経済的な夢を実現させましょう。",
    "startFree": "無料で始める",
    "seeDemo": "デモを見る",
    "stats": {
      "activeUsers": "アクティブユーザー",
      "goalsCreated": "作成された目標",
      "savingsAchieved": "達成された貯金"
    },
    "goalCard": {
      "dreamHouse": "夢のマイホーム",
      "by": "投稿者",
      "public": "公開",
      "progress": "進捗",
      "saved": "貯金済み",
      "goal": "目標",
      "dailyTarget": "1日の目標",
      "addSavings": "貯金を追加"
    }
  },
  "features": {
    "badge": "機能",
    "title": "あなたの目標達成に",
    "titleHighlight": "必要なすべて",
    "subtitle": "より賢く貯金し、夢をより早く実現するために設計された強力な機能。",
    "items": {
      "unlimitedGoals": {
        "title": "無制限の目標",
        "description": "好きなだけ貯金目標を作成できます。制限も制約もありません。"
      },
      "autoCalculate": {
        "title": "自動計算",
        "description": "必要な日次、週次、または月次の貯金額を自動的に計算します。"
      },
      "beautifulDashboard": {
        "title": "美しいダッシュボード",
        "description": "直感的で美しいインターフェースですべての進捗を追跡できます。"
      },
      "sharePublicly": {
        "title": "公開共有",
        "description": "目標を公開して他の人にインスピレーションを与えるか、プライベートに保つことができます。"
      }
    },
    "cta": {
      "title": "より賢く貯金を始める準備はできましたか？",
      "subtitle": "すでに財務目標を達成している何千人ものユーザーに参加しましょう。",
      "button": "無料で始める"
    }
  },
  "community": {
    "badge": "コミュニティ",
    "title": "他の人の成功から",
    "titleHighlight": "インスピレーションを得る",
    "subtitle": "人々がどのような目標に取り組んでいるかを見て、あなたの目標達成のモチベーションを高めましょう。",
    "progress": "進捗",
    "saved": "貯金済み",
    "goal": "目標",
    "likes": "いいね",
    "exploreAll": "すべての目標を見る"
  },
  "howItWorks": {
    "badge": "使い方",
    "title": "夢を実現するための",
    "titleHighlight": "シンプルなステップ",
    "subtitle": "たった4つの簡単なステップでより賢い貯金を始めましょう。",
    "steps": {
      "step1": {
        "title": "目標を設定",
        "description": "目標金額と期限を設定して貯金目標を作成します。名前を追加し、公開またはプライベートにするかを選択します。"
      },
      "step2": {
        "title": "進捗を追跡",
        "description": "定期的に貯金を記録します。システムが自動的に目標達成に必要な1日の貯金額を計算します。"
      },
      "step3": {
        "title": "共有またはプライベート",
        "description": "目標を公開して他の人にインスピレーションを与えるか、個人的な追跡のためにプライベートに保つかを選択します。"
      },
      "step4": {
        "title": "成功を祝う",
        "description": "目標を達成したら、その成果を祝いましょう！バッジを獲得し、大きなコミュニティと成功を共有しましょう。"
      }
    },
    "cta": {
      "question": "旅を始める準備はできましたか？",
      "button": "最初の目標を作成"
    }
  },
  "testimonials": {
    "badge": "お客様の声",
    "title": "ユーザーの",
    "titleHighlight": "声を聞く",
    "subtitle": "DreamBuddyで財務目標を達成した何千人もの満足したユーザーに参加しましょう。",
    "stats": {
      "rating": "平均評価",
      "users": "満足したユーザー",
      "successRate": "成功率",
      "totalSaved": "総貯金額"
    }
  },
  "cta": {
    "icon": "✨",
    "title": "最初の貯金目標を",
    "titleLine2": "今日から始めましょう！",
    "subtitle": "すでにDreamBuddyで夢を現実に変えている何千人ものユーザーに参加しましょう。",
    "benefits": {
      "free": "無料 - クレジットカード不要",
      "unlimited": "無制限の貯金目標",
      "tracking": "美しい進捗追跡",
      "community": "コミュニティサポート＆インスピレーション"
    },
    "buttons": {
      "start": "無料で始める",
      "demo": "デモを見る"
    },
    "social": {
      "users": "ユーザー",
      "subtitle": "すでに賢く貯金中",
      "rating": "評価",
      "ratingSubtitle": "満足したユーザーから"
    }
  },
  "footer": {
    "description": "スマートな貯金追跡とコミュニティサポートで、あなたの夢を現実に変えましょう。",
    "product": "製品",
    "company": "会社",
    "legal": "法的情報",
    "newsletter": {
      "title": "ニュースレター",
      "subtitle": "貯金のヒントとアップデートを受け取る",
      "placeholder": "メールアドレス"
    },
    "links": {
      "features": "機能",
      "howItWorks": "使い方",
      "pricing": "料金",
      "faq": "よくある質問",
      "about": "会社概要",
      "blog": "ブログ",
      "careers": "採用情報",
      "contact": "お問い合わせ",
      "privacy": "プライバシー",
      "terms": "利用規約",
      "cookies": "クッキーポリシー",
      "licenses": "ライセンス"
    },
    "copyright": "DreamBuddy. 全著作権所有。",
    "bottom": {
      "privacy": "プライバシーポリシー",
      "terms": "利用規約",
      "cookies": "クッキー"
    }
  },
  "auth": {
    "backToHome": "ホームページに戻る",
    "leftPanel": {
      "title": "今日から貯金の旅を始めましょう",
      "subtitle": "DreamBuddyで夢を実現している何千人ものユーザーに参加しましょう。",
      "stats": {
        "users": "ユーザー",
        "goals": "目標",
        "saved": "貯金済み"
      },
      "quote": "DreamBuddyのおかげで、わずか2年で夢のマイホームのための貯金ができました！",
      "quoteAuthor": "満足したDreamBuddyユーザー"
    },
    "login": {
      "title": "おかえりなさい",
      "subtitle": "貯金の旅を続けるためにログインしてください",
      "continueWithGoogle": "Googleで続ける",
      "continueWithGithub": "Githubで続ける",
      "orContinueWith": "またはメールで続ける",
      "email": "メールアドレス",
      "emailPlaceholder": "メールアドレスを入力",
      "password": "パスワード",
      "passwordPlaceholder": "パスワードを入力",
      "rememberMe": "ログイン状態を保持",
      "forgotPassword": "パスワードを忘れましたか？",
      "signIn": "ログイン",
      "noAccount": "アカウントをお持ちでないですか？",
      "signUp": "新規登録",
      "invalidEmail": "無効なメールアドレスです",
      "passwordTooShort": "パスワードは6文字以上である必要があります",
      "successTitle": "成功",
      "successMessage": "ログインしました",
      "errorTitle": "エラー",
      "errorMessage": "ログインに失敗しました"
    },
    "register": {
      "title": "アカウント作成",
      "subtitle": "今日から夢のための貯金を始めましょう",
      "continueWithGoogle": "Googleで続ける",
      "continueWithGithub": "Githubで続ける",
      "orRegisterWith": "またはメールで登録",
      "name": "フルネーム",
      "namePlaceholder": "お名前を入力",
      "email": "メールアドレス",
      "emailPlaceholder": "メールアドレスを入力",
      "password": "パスワード",
      "passwordPlaceholder": "パスワードを作成",
      "confirmPassword": "パスワード確認",
      "confirmPasswordPlaceholder": "パスワードを確認",
      "agreeToTerms": "同意します",
      "termsOfService": "利用規約",
      "and": "と",
      "privacyPolicy": "プライバシーポリシー",
      "createAccount": "アカウントを作成",
      "haveAccount": "すでにアカウントをお持ちですか？",
      "signIn": "ログイン",
      "nameRequired": "名前は必須です",
      "username": "ユーザー名",
      "usernamePlaceholder": "ユーザー名を入力",
      "usernameTooShort": "ユーザー名は3文字以上である必要があります",
      "mustAgreeTerms": "利用規約に同意する必要があります",
      "passwordsDoNotMatch": "パスワードが一致しません",
      "successMessage": "アカウントが正常に作成されました",
      "errorMessage": "登録に失敗しました"
    },
    "forgotPassword": {
      "title": "パスワードをリセット",
      "subtitle": "メールアドレスを入力すると、パスワードリセット用のリンクをお送りします",
      "email": "メールアドレス",
      "emailPlaceholder": "メールアドレスを入力",
      "emailHint": "このメールアドレスにパスワードリセット用のリンクを送信します",
      "sendResetLink": "リセットリンクを送信",
      "backToLogin": "ログインに戻る",
      "checkEmail": "メールをご確認ください",
      "emailSent": "パスワードリセット用のリンクを送信しました：",
      "instructions": "メール内のリンクをクリックしてパスワードをリセットしてください。メールが見つからない場合は、迷惑メールフォルダをご確認ください。",
      "resendEmail": "メールを再送信"
    }
  }
}
```

##### 11.7 เพิ่มโค้ดในไฟล์ `app/locales/la.json`
```json
{
  "nav": {
    "features": "ຄຸນສົມບັດ",
    "howItWorks": "ວິທີໃຊ້ງານ",
    "community": "ຊຸມຊົນ",
    "testimonials": "ຄຳຄິດເຫັນ",
    "signIn": "ເຂົ້າສູ່ລະບົບ",
    "startFree": "ເລີ່ມໃຊ້ຟຣີ"
  },
  "hero": {
    "badge": "#1 ແອັບຕິດຕາມເປົ້າໝາຍການອອມ",
    "title": "ປ່ຽນຄວາມຝັນ",
    "titleHighlight": "ໃຫ້ເປັນຈິງ",
    "subtitle": "ກຳນົດເປົ້າໝາຍການອອມ ຕິດຕາມຄວາມຄືບໜ້າອັດຕະໂນມັດ ແລະ ແບ່ງປັນການເດີນທາງຂອງທ່ານກັບຊຸມຊົນ ເຮັດໃຫ້ຄວາມຝັນດ້ານການເງິນຂອງທ່ານເປັນຈິງດ້ວຍ DreamBuddy",
    "startFree": "ເລີ່ມໃຊ້ຟຣີ",
    "seeDemo": "ເບິ່ງຕົວຢ່າງ",
    "stats": {
      "activeUsers": "ຜູ້ໃຊ້ງານ",
      "goalsCreated": "ເປົ້າໝາຍທີ່ສ້າງ",
      "savingsAchieved": "ເງິນອອມທີ່ໄດ້"
    },
    "goalCard": {
      "dreamHouse": "ເຮືອນໃນຝັນ",
      "by": "ໂດຍ",
      "public": "ສາທາລະນະ",
      "progress": "ຄວາມຄືບໜ້າ",
      "saved": "ອອມແລ້ວ",
      "goal": "ເປົ້າໝາຍ",
      "dailyTarget": "ເປົ້າໝາຍລາຍວັນ",
      "addSavings": "ເພີ່ມເງິນອອມ"
    }
  },
  "features": {
    "badge": "ຄຸນສົມບັດ",
    "title": "ທຸກສິ່ງທີ່ທ່ານຕ້ອງການ",
    "titleHighlight": "ເພື່ອບັນລຸເປົ້າໝາຍ",
    "subtitle": "ຄຸນສົມບັດທີ່ມີປະສິດທິພາບທີ່ອອກແບບມາເພື່ອຊ່ວຍໃຫ້ທ່ານອອມຢ່າງສະຫລາດແລະບັນລຸຄວາມຝັນໄດ້ໄວຂຶ້ນ",
    "items": {
      "unlimitedGoals": {
        "title": "ເປົ້າໝາຍບໍ່ຈຳກັດ",
        "description": "ສ້າງເປົ້າໝາຍການອອມໄດ້ບໍ່ຈຳກັດ ບໍ່ມີຂໍ້ຈຳກັດ"
      },
      "autoCalculate": {
        "title": "ຄຳນວນອັດຕະໂນມັດ",
        "description": "ຄຳນວນການອອມລາຍວັນ ລາຍອາທິດ ຫຼືລາຍເດືອນທີ່ຈຳເປັນໂດຍອັດຕະໂນມັດ"
      },
      "beautifulDashboard": {
        "title": "ແດັຊບອດສວຍງາມ",
        "description": "ຕິດຕາມຄວາມຄືບໜ້າທັງໝົດຂອງທ່ານດ້ວຍອິນເຕີເຟດທີ່ໃຊ້ງານງ່າຍແລະສວຍງາມ"
      },
      "sharePublicly": {
        "title": "ແບ່ງປັນສູ່ສາທາລະນະ",
        "description": "ສ້າງແຮງບັນດານໃຈໃຫ້ຜູ້ອື່ນດ້ວຍການແບ່ງປັນເປົ້າໝາຍຂອງທ່ານ ຫຼືເກັບເປັນຄວາມລັບ"
      }
    },
    "cta": {
      "title": "ພ້ອມທີ່ຈະເລີ່ມອອມຢ່າງສະຫລາດແລ້ວບໍ?",
      "subtitle": "ເຂົ້າຮ່ວມກັບຜູ້ໃຊ້ຫຼາຍພັນຄົນທີ່ກຳລັງບັນລຸເປົ້າໝາຍດ້ານການເງິນຂອງພວກເຂົາ",
      "button": "ເລີ່ມໃຊ້ງານຟຣີ"
    }
  },
  "community": {
    "badge": "ຊຸມຊົນ",
    "title": "ຮັບແຮງບັນດານໃຈຈາກ",
    "titleHighlight": "ຄວາມສຳເລັດຂອງຜູ້ອື່ນ",
    "subtitle": "ເບິ່ງເປົ້າໝາຍທີ່ຜູ້ຄົນກຳລັງເຮັດວຽກແລະຮັບແຮງຈູງໃຈໃນການບັນລຸເປົ້າໝາຍຂອງທ່ານ",
    "progress": "ຄວາມຄືບໜ້າ",
    "saved": "ອອມແລ້ວ",
    "goal": "ເປົ້າໝາຍ",
    "likes": "ຖືກໃຈ",
    "exploreAll": "ສຳຫຼວດເປົ້າໝາຍທັງໝົດ"
  },
  "howItWorks": {
    "badge": "ວິທີໃຊ້ງານ",
    "title": "ຂັ້ນຕອນງ່າຍໆ ໃນ",
    "titleHighlight": "ການບັນລຸຄວາມຝັນ",
    "subtitle": "ເລີ່ມອອມຢ່າງສະຫລາດໃນພຽງ 4 ຂັ້ນຕອນງ່າຍໆ",
    "steps": {
      "step1": {
        "title": "ກຳນົດເປົ້າໝາຍ",
        "description": "ສ້າງເປົ້າໝາຍການອອມພ້ອມຈຳນວນເປົ້າໝາຍແລະກຳນົດເວລາ ເພີ່ມຊື່ແລະເລືອກທີ່ຈະເຮັດໃຫ້ເປັນສາທາລະນະຫຼືສ່ວນຕົວ"
      },
      "step2": {
        "title": "ຕິດຕາມຄວາມຄືບໜ້າ",
        "description": "ບັນທຶກການອອມຂອງທ່ານເປັນປະຈຳ ລະບົບຂອງພວກເຮົາຈະຄຳນວນຈຳນວນທີ່ທ່ານຕ້ອງອອມລາຍວັນເພື່ອໃຫ້ເຖິງເປົ້າໝາຍໂດຍອັດຕະໂນມັດ"
      },
      "step3": {
        "title": "ແບ່ງປັນຫຼືເກັບເປັນຄວາມລັບ",
        "description": "ເລືອກແບ່ງປັນເປົ້າໝາຍຂອງທ່ານຕໍ່ສາທາລະນະເພື່ອສ້າງແຮງບັນດານໃຈໃຫ້ຜູ້ອື່ນ ຫຼືເກັບເປັນຄວາມລັບສຳລັບການຕິດຕາມສ່ວນຕົວເທົ່ານັ້ນ"
      },
      "step4": {
        "title": "ສະເຫຼີມສະຫຼອງຄວາມສຳເລັດ",
        "description": "ເມື່ອທ່ານເຖິງເປົ້າໝາຍ ສະເຫຼີມສະຫຼອງຄວາມສຳເລັດຂອງທ່ານ! ຮັບເຫຼຍຍາແລະແບ່ງປັນຄວາມສຳເລັດຂອງທ່ານກັບຊຸມຊົນ 🎉"
      }
    },
    "cta": {
      "question": "ພ້ອມທີ່ຈະເລີ່ມຕົ້ນການເດີນທາງຂອງທ່ານແລ້ວບໍ?",
      "button": "ສ້າງເປົ້າໝາຍທຳອິດຂອງທ່ານ"
    }
  },
  "testimonials": {
    "badge": "ຄຳຄິດເຫັນ",
    "title": "ສິ່ງທີ່ຜູ້ໃຊ້ຂອງພວກເຮົາ",
    "titleHighlight": "ເວົ້າ",
    "subtitle": "ເຂົ້າຮ່ວມກັບຜູ້ໃຊ້ທີ່ມີຄວາມສຸກຫຼາຍພັນຄົນທີ່ບັນລຸເປົ້າໝາຍດ້ານການເງິນດ້ວຍ DreamBuddy",
    "stats": {
      "rating": "ຄະແນນສະເລ່ຍ",
      "users": "ຜູ້ໃຊ້ທີ່ມີຄວາມສຸກ",
      "successRate": "ອັດຕາຄວາມສຳເລັດ",
      "totalSaved": "ຍອດອອມທັງໝົດ"
    }
  },
  "cta": {
    "icon": "✨",
    "title": "ເລີ່ມສ້າງເປົ້າໝາຍ",
    "titleLine2": "ການອອມທຳອິດຂອງທ່ານມື້ນີ້!",
    "subtitle": "ເຂົ້າຮ່ວມກັບຜູ້ໃຊ້ຫຼາຍພັນຄົນທີ່ກຳລັງປ່ຽນຄວາມຝັນໃຫ້ເປັນຈິງດ້ວຍ DreamBuddy",
    "benefits": {
      "free": "ຟຣີຕະຫຼອດໄປ - ບໍ່ຕ້ອງໃຊ້ບັດເຄຣດິດ",
      "unlimited": "ເປົ້າໝາຍການອອມບໍ່ຈຳກັດ",
      "tracking": "ການຕິດຕາມຄວາມຄືບໜ້າທີ່ສວຍງາມ",
      "community": "ການສະໜັບສະໜູນແລະແຮງບັນດານໃຈຈາກຊຸມຊົນ"
    },
    "buttons": {
      "start": "ເລີ່ມໃຊ້ງານຟຣີ",
      "demo": "ເບິ່ງສາທິດ"
    },
    "social": {
      "users": "ຜູ້ໃຊ້",
      "subtitle": "ກຳລັງອອມຢ່າງສະຫລາດ",
      "rating": "ຄະແນນ",
      "ratingSubtitle": "ຈາກຜູ້ໃຊ້ທີ່ມີຄວາມສຸກ"
    }
  },
  "footer": {
    "description": "ປ່ຽນຄວາມຝັນຂອງທ່ານໃຫ້ເປັນຈິງດ້ວຍການຕິດຕາມການອອມຢ່າງສະຫລາດແລະການສະໜັບສະໜູນຈາກຊຸມຊົນ",
    "product": "ຜະລິດຕະພັນ",
    "company": "ບໍລິສັດ",
    "legal": "ກົດໝາຍ",
    "newsletter": {
      "title": "ຈົດໝາຍຂ່າວ",
      "subtitle": "ຮັບເຄັດລັບການອອມແລະອັບເດດ",
      "placeholder": "ອີເມລຂອງທ່ານ"
    },
    "links": {
      "features": "ຄຸນສົມບັດ",
      "howItWorks": "ວິທີໃຊ້ງານ",
      "pricing": "ລາຄາ",
      "faq": "ຄຳຖາມທີ່ພົບເລື້ອຍ",
      "about": "ກ່ຽວກັບ",
      "blog": "ບລ໋ອກ",
      "careers": "ອາຊີບ",
      "contact": "ຕິດຕໍ່",
      "privacy": "ຄວາມເປັນສ່ວນຕົວ",
      "terms": "ເງື່ອນໄຂ",
      "cookies": "ນະໂຍບາຍຄຸກກີ້",
      "licenses": "ໃບອະນຸຍາດ"
    },
    "copyright": "DreamBuddy ສະຫງວນລິຂະສິດ",
    "bottom": {
      "privacy": "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
      "terms": "ເງື່ອນໄຂການໃຫ້ບໍລິການ",
      "cookies": "ຄຸກກີ້"
    }
  },
  "auth": {
    "backToHome": "ກັບໄປໜ້າຫຼັກ",
    "leftPanel": {
      "title": "ເລີ່ມຕົ້ນການອອມເງິນຂອງທ່ານມື້ນີ້",
      "subtitle": "ເຂົ້າຮ່ວມກັບຜູ້ໃຊ້ຫລາຍພັນຄົນທີ່ກຳລັງເຮັດໃຫ້ຄວາມຝັນເປັນຈິງດ້ວຍ DreamBuddy",
      "stats": {
        "users": "ຜູ້ໃຊ້",
        "goals": "ເປົ້າໝາຍ",
        "saved": "ອອມແລ້ວ"
      },
      "quote": "DreamBuddy ຊ່ວຍໃຫ້ຂ້ອຍອອມເງິນຊື້ເຮືອນໃນຝັນພາຍໃນ 2 ປີ!",
      "quoteAuthor": "ຜູ້ໃຊ້ DreamBuddy ທີ່ມີຄວາມສຸກ"
    },
    "login": {
      "title": "ຍິນດີຕ້ອນຮັບກັບມາ",
      "subtitle": "ເຂົ້າສູ່ລະບົບເພື່ອດຳເນີນການອອມເງິນຕໍ່",
      "continueWithGoogle": "ດຳເນີນການຕໍ່ດ້ວຍ Google",
      "continueWithGithub": "ດຳເນີນການຕໍ່ດ້ວຍ Github",
      "orContinueWith": "ຫຼືດຳເນີນການຕໍ່ດ້ວຍອີເມວ",
      "email": "ທີ່ຢູ່ອີເມວ",
      "emailPlaceholder": "ປ້ອນອີເມວຂອງທ່ານ",
      "password": "ລະຫັດຜ່ານ",
      "passwordPlaceholder": "ປ້ອນລະຫັດຜ່ານຂອງທ່ານ",
      "rememberMe": "ຈົດຈຳຂ້ອຍ",
      "forgotPassword": "ລືມລະຫັດຜ່ານ?",
      "signIn": "ເຂົ້າສູ່ລະບົບ",
      "noAccount": "ຍັງບໍ່ມີບັນຊີ?",
      "signUp": "ສະໝັກສະມາຊິກ",
      "invalidEmail": "ທີ່ຢູ່ອີເມວບໍ່ຖືກຕ້ອງ",
      "passwordTooShort": "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ",
      "successTitle": "ສຳເລັດ",
      "successMessage": "ເຂົ້າສູ່ລະບົບສຳເລັດແລ້ວ",
      "errorTitle": "ຜິດພາດ",
      "errorMessage": "ການເຂົ້າສູ່ລະບົບລົ້ມເຫລວ"
    },
    "register": {
      "title": "ສ້າງບັນຊີ",
      "subtitle": "ເລີ່ມອອມເງິນເພື່ອຄວາມຝັນຂອງທ່ານມື້ນີ້",
      "continueWithGoogle": "ດຳເນີນການຕໍ່ດ້ວຍ Google",
      "continueWithGithub": "ດຳເນີນການຕໍ່ດ້ວຍ Github",
      "orRegisterWith": "ຫຼືສະໝັກດ້ວຍອີເມວ",
      "name": "ຊື່-ນາມສະກຸນ",
      "namePlaceholder": "ປ້ອນຊື່ຂອງທ່ານ",
      "email": "ທີ່ຢູ່ອີເມວ",
      "emailPlaceholder": "ປ້ອນອີເມວຂອງທ່ານ",
      "password": "ລະຫັດຜ່ານ",
      "passwordPlaceholder": "ສ້າງລະຫັດຜ່ານ",
      "confirmPassword": "ຢືນຢັນລະຫັດຜ່ານ",
      "confirmPasswordPlaceholder": "ຢືນຢັນລະຫັດຜ່ານຂອງທ່ານ",
      "agreeToTerms": "ຂ້ອຍຍອມຮັບ",
      "termsOfService": "ເງື່ອນໄຂການໃຫ້ບໍລິການ",
      "and": "ແລະ",
      "privacyPolicy": "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
      "createAccount": "ສ້າງບັນຊີ",
      "haveAccount": "ມີບັນຊີຢູ່ແລ້ວ?",
      "signIn": "ເຂົ້າສູ່ລະບົບ",
      "nameRequired": "ກະລຸນາໃສ່ຊື່",
      "username": "ຊື່ຜູ້ໃຊ້",
      "usernamePlaceholder": "ໃສ່ຊື່ຜູ້ໃຊ້ຂອງທ່ານ",
      "usernameTooShort": "ຊື່ຜູ້ໃຊ້ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ",
      "mustAgreeTerms": "ທ່ານຕ້ອງຍອມຮັບເງື່ອນໄຂ",
      "passwordsDoNotMatch": "ລະຫັດຜ່ານບໍ່ກົງກັນ",
      "successMessage": "ສ້າງບັນຊີສຳເລັດແລ້ວ",
      "errorMessage": "ການລົງທະບຽນລົ້ມເຫລວ"
    },
    "forgotPassword": {
      "title": "ຣີເຊັດລະຫັດຜ່ານ",
      "subtitle": "ປ້ອນທີ່ຢູ່ອີເມວຂອງທ່ານ ແລະເຮົາຈະສົ່ງລິ້ງຣີເຊັດລະຫັດຜ່ານໃຫ້ທ່ານ",
      "email": "ທີ່ຢູ່ອີເມວ",
      "emailPlaceholder": "ປ້ອນອີເມວຂອງທ່ານ",
      "emailHint": "ເຮົາຈະສົ່ງລິ້ງຣີເຊັດລະຫັດຜ່ານໄປຫາອີເມວນີ້",
      "sendResetLink": "ສົ່ງລິ້ງຣີເຊັດ",
      "backToLogin": "ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ",
      "checkEmail": "ກວດສອບອີເມວຂອງທ່ານ",
      "emailSent": "ເຮົາໄດ້ສົ່ງລິ້ງຣີເຊັດລະຫັດຜ່ານໄປຫາ",
      "instructions": "ຄລິກລິ້ງໃນອີເມວເພື່ອຣີເຊັດລະຫັດຜ່ານຂອງທ່ານ ຖ້າທ່ານບໍ່ເຫັນອີເມວ ໃຫ້ກວດສອບໃນໂຟນເດີສະແປມ",
      "resendEmail": "ສົ່ງອີເມວອີກຄັ້ງ"
    }
  }
}
```

##### 11.8 สร้างไฟล์ `app/components/App/LanguageSwitcher.vue` และเพิ่มโค้ดต่อไปนี้
```vue
<script setup lang="ts">

// สำหรับการแปลภาษา
const { $getLocale, $switchLocale } = useI18n()

// ตัวแปรภาษาที่รองรับ
const languages = [
  { code: 'en', name: 'English', shortCode: 'US' },
  { code: 'th', name: 'ไทย', shortCode: 'TH' },
  { code: 'jp', name: '日本語', shortCode: 'JP' },
  { code: 'la', name: 'ລາວ', shortCode: 'LA' }
]

// ตัวแปรสถานะเปิด/ปิดเมนูภาษา
const isOpen = ref(false)

// ตัวแปรภาษาปัจจุบัน
const currentLocale = computed(() => $getLocale())

// ตัวแปรภาษาปัจจุบัน
const currentLanguage = computed(() => 
  languages.find(lang => lang.code === currentLocale.value) || languages[0]
)

// ฟังก์ชันเปลี่ยนภาษา
const handleChangeLanguage = (langCode: string) => {
  $switchLocale(langCode)
  // บันทึกลง localStorage
  if (import.meta.client) {
    localStorage.setItem('dreambuddy-locale', langCode)
  }
  isOpen.value = false
}
</script>

<template>
  <UPopover v-model:open="isOpen">
    <UButton
      color="neutral"
      variant="ghost"
      size="md"
      class="cursor-pointer"
    >
      <span class="font-medium">{{ currentLanguage?.shortCode }}</span>
      <span class="ml-2 hidden sm:inline">{{ currentLanguage?.name }}</span>
      <Icon name="i-heroicons-chevron-down" class="w-4 h-4 ml-1" />
    </UButton>

    <template #content>
      <div class="w-48 p-1">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="handleChangeLanguage(lang.code)"
          class="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
          :class="{ 'bg-primary-50 dark:bg-primary-950': lang.code === currentLocale }"
        >
          <span class="font-semibold text-gray-600 dark:text-gray-400">{{ lang.shortCode }}</span>
          <span class="font-medium">{{ lang.name }}</span>
          <Icon 
            v-if="lang.code === currentLocale"
            name="i-heroicons-check" 
            class="w-4 h-4 ml-auto text-primary-500" 
          />
        </button>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>
</style>
```

##### 11.9 แก้ไขไฟล์ `app/components/App/Header.vue` เพื่อเพิ่มตัวสลับภาษา
```vue
<script setup lang="ts">

// สำหรับการแปลภาษา
const { $t } = useI18n()

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
    const headerOffset = 80 // Height of sticky header + some padding
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
          
          <UButton variant="ghost" size="md" class="cursor-pointer">
            {{ $t('nav.signIn') }}
          </UButton>
          <UButton size="md" color="primary" class="cursor-pointer">
            {{ $t('nav.startFree') }}
          </UButton>
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
            <UButton variant="ghost" size="md" block class="cursor-pointer">
              {{ $t('nav.signIn') }}
            </UButton>
            <UButton size="md" color="primary" block class="cursor-pointer">
              {{ $t('nav.startFree') }}
            </UButton>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
</style>
```

##### 11.10 ทดสอบการทำงาน
รันแอปพลิเคชันของคุณและทดสอบการสลับเปลี่ยนภาษาต่างๆ ผ่านตัวสลับภาษาในส่วนหัว ตรวจสอบให้แน่ใจว่าข้อความทั้งหมดในแอปพลิเคชันเปลี่ยนไปตามภาษาที่เลือกอย่างถูกต้อง และการตั้งค่าภาษาจะถูกบันทึกใน `localStorage` เพื่อให้คงอยู่ระหว่างการเยี่ยมชมหน้า

```bash
bun run dev
```

##### 11.11 แก้ไขไฟล์ต่างๆ ให้รองรับการแปลภาษา
```
dreambuddy/
├─ app/
│  ├─ components/
│  │  ├─ App/
│  │  │  ├─ Footer.vue
│  │  │  ├─ Header.vue
│  │  ├─ Landing/
│  │  │  ├─ Hero.vue
│  │  │  ├─ Feature.vue
│  │  │  ├─ Howitwork.vue
│  │  │  ├─ Comunity.vue
│  │  │  ├─ Testimonials.vue
│  │  │  ├─ CTA.vue
```

##### 11.12 แก้ไขไฟล์ `app/components/App/Header.vue` เพื่อเพิ่มการแปลภาษา
```vue
<script setup lang="ts">

// สำหรับการแปลภาษา
const { $t, $localePath } = useI18n()

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
          
          <UButton variant="ghost" size="md" class="cursor-pointer" @click="$router.push($localePath('/auth/login'))">
            {{ $t('nav.signIn') }}
          </UButton>
          <UButton size="md" color="primary" class="cursor-pointer" @click="$router.push($localePath('/auth/register'))">
            {{ $t('nav.startFree') }}
          </UButton>
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
            <UButton variant="ghost" size="md" block class="cursor-pointer" @click="$router.push($localePath('/auth/login')); isMobileMenuOpen = false">
              {{ $t('nav.signIn') }}
            </UButton>
            <UButton size="md" color="primary" block class="cursor-pointer" @click="$router.push($localePath('/auth/register')); isMobileMenuOpen = false">
              {{ $t('nav.startFree') }}
            </UButton>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
</style>
```

##### 11.13 แก้ไขไฟล์ `app/components/App/Footer.vue` เพื่อเพิ่มการแปลภาษา
```vue
<script setup lang="ts">
const { $t } = useI18n()

const currentYear = new Date().getFullYear()

const footerLinks = computed(() => ({
  product: [
    { name: $t('footer.links.features'), href: '#features' },
    { name: $t('footer.links.howItWorks'), href: '#how-it-works' },
    { name: $t('footer.links.pricing'), href: '#' },
    { name: $t('footer.links.faq'), href: '#' }
  ],
  company: [
    { name: $t('footer.links.about'), href: '#' },
    { name: $t('footer.links.blog'), href: '#' },
    { name: $t('footer.links.careers'), href: '#' },
    { name: $t('footer.links.contact'), href: '#' }
  ],
  legal: [
    { name: $t('footer.links.privacy'), href: '#' },
    { name: $t('footer.links.terms'), href: '#' },
    { name: $t('footer.links.cookies'), href: '#' },
    { name: $t('footer.links.licenses'), href: '#' }
  ],
  social: [
    { name: 'Twitter', icon: 'i-heroicons-link', href: '#' },
    { name: 'Facebook', icon: 'i-heroicons-link', href: '#' },
    { name: 'Instagram', icon: 'i-heroicons-link', href: '#' },
    { name: 'GitHub', icon: 'i-heroicons-link', href: '#' }
  ]
}))
</script>

<template>
  <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
        <!-- Brand Column -->
        <div class="col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <Icon name="i-heroicons-sparkles" class="w-8 h-8 text-primary-500" />
            <span class="text-xl font-bold bg-linear-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
              DreamBuddy
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
            {{ $t('footer.description') }}
          </p>
          <!-- Social Links -->
          <div class="flex space-x-3">
            <a 
              v-for="social in footerLinks.social" 
              :key="social.name"
              :href="social.href"
              class="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-primary-500 dark:hover:bg-primary-500 flex items-center justify-center transition-colors group"
              :aria-label="social.name"
            >
              <Icon :name="social.icon" class="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white" />
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">{{ $t('footer.product') }}</h3>
          <ul class="space-y-3">
            <li v-for="(link, index) in footerLinks.product" :key="index">
              <a 
                :href="link.href"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">{{ $t('footer.company') }}</h3>
          <ul class="space-y-3">
            <li v-for="(link, index) in footerLinks.company" :key="index">
              <a 
                :href="link.href"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal Links -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">{{ $t('footer.legal') }}</h3>
          <ul class="space-y-3">
            <li v-for="(link, index) in footerLinks.legal" :key="index">
              <a 
                :href="link.href"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="col-span-2 md:col-span-4 lg:col-span-1">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">{{ $t('footer.newsletter.title') }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {{ $t('footer.newsletter.subtitle') }}
          </p>
          <div class="flex gap-2">
            <input 
              type="email" 
              :placeholder="String($t('footer.newsletter.placeholder'))"
              class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <UButton size="sm" color="primary" class="cursor-pointer">
              <Icon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </UButton>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-gray-200 dark:border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            © {{ currentYear }} {{ $t('footer.copyright') }}
          </p>
          <div class="flex items-center space-x-6">
            <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
              {{ $t('footer.bottom.privacy') }}
            </a>
            <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
              {{ $t('footer.bottom.terms') }}
            </a>
            <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
              {{ $t('footer.bottom.cookies') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
</style>
```

##### 11.14 แก้ไขไฟล์ `app/components/Landing/Hero.vue` เพื่อเพิ่มการแปลภาษา
```vue
<script setup lang="ts">
const { $t } = useI18n()

const stats = computed(() => [
  { value: '10,000+', label: $t('hero.stats.activeUsers') },
  { value: '50,000+', label: $t('hero.stats.goalsCreated') },
  { value: '₿1M+', label: $t('hero.stats.savingsAchieved') },
])

const progress = ref(65)

</script>

<template>
  <section class="relative overflow-hidden bg-linear-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 sm:py-32">
    <!-- Background decoration -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Column - Content -->
        <div class="text-center lg:text-left space-y-8">
          <!-- Badge -->
          <div class="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <Icon name="i-heroicons-sparkles" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span class="text-sm font-medium text-primary-700 dark:text-primary-300">
              {{ $t('hero.badge') }}
            </span>
          </div>

          <!-- Headline -->
          <div class="space-y-4">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
              {{ $t('hero.title') }}
              <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {{ $t('hero.titleHighlight') }}
              </span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
              {{ $t('hero.subtitle') }}
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <UButton size="xl" color="primary" class="px-4 cursor-pointer">
              <Icon name="i-heroicons-rocket-launch" class="w-5 h-5" />
              {{ $t('hero.startFree') }}
            </UButton>
            <UButton size="xl" variant="outline" color="neutral" class="px-4 cursor-pointer">
              <Icon name="i-heroicons-play-circle" class="w-5 h-5" />
              {{ $t('hero.seeDemo') }}
            </UButton>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div v-for="(stat, index) in stats" :key="index" class="text-center lg:text-left">
              <div class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {{ stat.value }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Mockup -->
        <div class="relative">
          <!-- Goal Card Mockup -->
          <div class="relative z-10 mx-auto max-w-md lg:max-w-lg">
            <UCard class="shadow-2xl">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                      <Icon name="i-heroicons-home" class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">{{ $t('hero.goalCard.dreamHouse') }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('hero.goalCard.by') }} @johndoe</p>
                    </div>
                  </div>
                  <UBadge color="primary" variant="subtle">{{ $t('hero.goalCard.public') }}</UBadge>
                </div>
              </template>

              <div class="space-y-4">
                <!-- Progress Bar -->
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('hero.goalCard.progress') }}</span>
                    <span class="text-sm font-bold text-primary-600 dark:text-primary-400">65%</span>
                  </div>
                  <UProgress v-model="progress" size="md" aria-label="Goal progress: 65%" />
                </div>

                <!-- Amount -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('hero.goalCard.saved') }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">$65,000</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('hero.goalCard.goal') }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">$100,000</p>
                  </div>
                </div>

                <!-- Daily Savings -->
                <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('hero.goalCard.dailyTarget') }}</span>
                    <span class="text-sm font-semibold text-primary-700 dark:text-primary-300">$95.89/day</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                  <UButton block variant="soft" class="cursor-pointer px-4 py-2" aria-label="Add savings to goal">
                    <Icon name="i-heroicons-plus" class="w-4 h-4 mr-1" />
                    {{ $t('hero.goalCard.addSavings') }}
                  </UButton>
                  <UButton color="neutral" variant="outline" square class="cursor-pointer px-4 py-2" aria-label="Like this goal">
                    <Icon name="i-heroicons-heart" class="w-4 h-4" />
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Floating Elements -->
          <div class="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
          <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-400 rounded-full opacity-20 blur-xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 11.15 แก้ไขไฟล์ `app/components/Landing/Feature.vue` เพื่อเพิ่มการแปลภาษา
```vue
<script setup lang="ts">
const { $t } = useI18n()

const features = computed(() => [
  {
    icon: 'i-heroicons-flag',
    title: $t('features.items.unlimitedGoals.title'),
    description: $t('features.items.unlimitedGoals.description'),
    color: 'secondary'
  },
  {
    icon: 'i-heroicons-calculator',
    title: $t('features.items.autoCalculate.title'),
    description: $t('features.items.autoCalculate.description'),
    color: 'success'
  },
  {
    icon: 'i-heroicons-chart-bar',
    title: $t('features.items.beautifulDashboard.title'),
    description: $t('features.items.beautifulDashboard.description'),
    color: 'warning'
  },
  {
    icon: 'i-heroicons-share',
    title: $t('features.items.sharePublicly.title'),
    description: $t('features.items.sharePublicly.description'),
    color: 'error'
  }
])
</script>

<template>
  <section id="features" class="py-20 sm:py-32 bg-white dark:bg-gray-950">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <UBadge color="primary" variant="subtle" size="lg" class="mb-4">
          {{ $t('features.badge') }}
        </UBadge>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {{ $t('features.title') }}
          <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {{ $t('features.titleHighlight') }}
          </span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ $t('features.subtitle') }}
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="relative group"
        >
          <UCard class="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="space-y-4">
              <!-- Icon -->
              <div 
                class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                :class="{
                  'bg-secondary-100 dark:bg-secondary-900/30': feature.color === 'secondary',
                  'bg-success-100 dark:bg-success-900/30': feature.color === 'success',
                  'bg-warning-100 dark:bg-warning-900/30': feature.color === 'warning',
                  'bg-error-100 dark:bg-error-900/30': feature.color === 'error',
                }"
              >
                <Icon 
                  :name="feature.icon" 
                  class="w-7 h-7"
                  :class="{
                    'text-secondary-600 dark:text-secondary-400': feature.color === 'secondary',
                    'text-success-600 dark:text-success-400': feature.color === 'success',
                    'text-warning-600 dark:text-warning-400': feature.color === 'warning',
                    'text-error-600 dark:text-error-400': feature.color === 'error',
                  }"
                />
              </div>

              <!-- Content -->
              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {{ feature.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-16 text-center">
        <UCard class="max-w-4xl mx-auto bg-linear-to-r from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 border-primary-200 dark:border-primary-800">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex-1 text-left">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ $t('features.cta.title') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ $t('features.cta.subtitle') }}
              </p>
            </div>
            <UButton size="lg" color="primary" class="whitespace-nowrap cursor-pointer px-6 py-3">
              {{ $t('features.cta.button') }}
              <Icon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 11.6 แก้ไขไฟล์ `app/components/Landing/Howitwork.vue` เพื่อเพิ่มตัวสลับภาษา
```vue
<script setup lang="ts">

// สำหรับการแปลภาษา
const { $t } = useI18n()

// ตัวแปรขั้นตอนการทำงาน
const steps = computed(() => [
  {
    number: '01',
    title: $t('howItWorks.steps.step1.title'),
    description: $t('howItWorks.steps.step1.description'),
    icon: 'i-heroicons-flag',
    color: 'secondary'
  },
  {
    number: '02',
    title: $t('howItWorks.steps.step2.title'),
    description: $t('howItWorks.steps.step2.description'),
    icon: 'i-heroicons-chart-bar-square',
    color: 'success'
  },
  {
    number: '03',
    title: $t('howItWorks.steps.step3.title'),
    description: $t('howItWorks.steps.step3.description'),
    icon: 'i-heroicons-users',
    color: 'warning'
  },
  {
    number: '04',
    title: $t('howItWorks.steps.step4.title'),
    description: $t('howItWorks.steps.step4.description'),
    icon: 'i-heroicons-trophy',
    color: 'error'
  }
])
</script>

<template>
  <section id="how-it-works" class="py-20 sm:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <UBadge color="primary" variant="subtle" size="lg" class="mb-4">
          {{ $t('howItWorks.badge') }}
        </UBadge>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {{ $t('howItWorks.title') }}
          <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {{ $t('howItWorks.titleHighlight') }}
          </span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ $t('howItWorks.subtitle') }}
        </p>
      </div>

      <!-- Steps -->
      <div class="relative max-w-6xl mx-auto">
        <!-- Connection Line (Desktop) -->
        <div class="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-primary-200 via-purple-200 to-primary-200 dark:from-primary-900 dark:via-purple-900 dark:to-primary-900 -translate-y-1/2"></div>

        <!-- Steps Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="relative"
          >
            <div class="relative z-10">
              <!-- Number Badge -->
              <div class="flex justify-center mb-6">
                <div 
                  class="relative w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl shadow-lg"
                  :class="{
                    'bg-secondary-500 text-white': step.color === 'secondary',
                    'bg-success-500 text-white': step.color === 'success',
                    'bg-warning-500 text-white': step.color === 'warning',
                    'bg-error-500 text-white': step.color === 'error',
                  }"
                >
                  {{ step.number }}          
                </div>
              </div>

              <!-- Content Card -->
              <UCard class="text-center h-full">
                <div class="space-y-4">
                  <!-- Icon -->
                  <div class="flex justify-center">
                    <div 
                      class="w-14 h-14 rounded-xl flex items-center justify-center"
                      :class="{
                        'bg-secondary-100 dark:bg-primary-900/30': step.color === 'secondary',
                        'bg-success-100 dark:bg-success-900/30': step.color === 'success',
                        'bg-warning-100 dark:bg-warning-900/30': step.color === 'warning',
                        'bg-error-100 dark:bg-error-900/30': step.color === 'error',
                      }"
                    >
                      <Icon 
                        :name="step.icon" 
                        class="w-7 h-7"
                        :class="{
                          'text-secondary-600 dark:text-primary-400': step.color === 'secondary',
                          'text-success-600 dark:text-success-400': step.color === 'success',
                          'text-warning-600 dark:text-warning-400': step.color === 'warning',
                          'text-error-600 dark:text-error-400': step.color === 'error',
                        }"
                      />
                    </div>
                  </div>

                  <!-- Title & Description -->
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {{ step.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ step.description }}
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-16">
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ $t('howItWorks.cta.question') }}
        </p>
        <UButton size="xl" color="primary" class="shadow-lg shadow-primary-500/50 px-4 cursor-pointer">
          <Icon name="i-heroicons-rocket-launch" class="w-5 h-5" />
          {{ $t('howItWorks.cta.button') }}
        </UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 11.16 แก้ไขไฟล์ `app/components/Landing/Comunity.vue` เพื่อเพิ่มการแปลภาษา
```vue
<script setup lang="ts">
const { $t } = useI18n()

const communityGoals = [
  {
    id: 1,
    title: 'Dream House',
    author: 'Sarah Johnson',
    avatar: '👩',
    icon: 'i-heroicons-home',
    iconColor: 'primary',
    progress: 65,
    saved: 65000,
    target: 100000,
    likes: 234
  },
  {
    id: 2,
    title: 'World Travel',
    author: 'Mike Chen',
    avatar: '👨',
    icon: 'i-heroicons-globe-alt',
    iconColor: 'success',
    progress: 42,
    saved: 8400,
    target: 20000,
    likes: 189
  },
  {
    id: 3,
    title: 'New Car',
    author: 'Emma Davis',
    avatar: '👧',
    icon: 'i-heroicons-truck',
    iconColor: 'warning',
    progress: 78,
    saved: 31200,
    target: 40000,
    likes: 156
  },
  {
    id: 4,
    title: 'Wedding',
    author: 'Alex Brown',
    avatar: '🧑',
    icon: 'i-heroicons-heart',
    iconColor: 'error',
    progress: 55,
    saved: 16500,
    target: 30000,
    likes: 312
  },
  {
    id: 5,
    title: 'Education Fund',
    author: 'Lisa Wang',
    avatar: '👩‍🎓',
    icon: 'i-heroicons-academic-cap',
    iconColor: 'primary',
    progress: 88,
    saved: 44000,
    target: 50000,
    likes: 267
  },
  {
    id: 6,
    title: 'Emergency Fund',
    author: 'Tom Wilson',
    avatar: '👨‍💼',
    icon: 'i-heroicons-shield-check',
    iconColor: 'success',
    progress: 92,
    saved: 9200,
    target: 10000,
    likes: 445
  },
  {
    id: 7,
    title: 'Business Startup',
    author: 'Nina Patel',
    avatar: '👩‍💻',
    icon: 'i-heroicons-building-office',
    iconColor: 'warning',
    progress: 35,
    saved: 17500,
    target: 50000,
    likes: 198
  },
  {
    id: 8,
    title: 'Dream Vacation',
    author: 'Chris Lee',
    avatar: '🧑',
    icon: 'i-heroicons-paper-airplane',
    iconColor: 'error',
    progress: 70,
    saved: 7000,
    target: 10000,
    likes: 223
  }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<template>
  <section id="community" class="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <UBadge color="primary" variant="subtle" size="lg" class="mb-4">
          {{ $t('community.badge') }}
        </UBadge>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {{ $t('community.title') }}
          <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {{ $t('community.titleHighlight') }}
          </span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ $t('community.subtitle') }}
        </p>
      </div>

      <!-- Goals Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div 
          v-for="goal in communityGoals" 
          :key="goal.id"
          class="group"
        >
          <UCard class="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <div class="text-2xl">{{ goal.avatar }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  @{{ goal.author.toLowerCase().replace(' ', '') }}
                </div>
              </div>
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="{
                  'bg-primary-100 dark:bg-primary-900/30': goal.iconColor === 'primary',
                  'bg-success-100 dark:bg-success-900/30': goal.iconColor === 'success',
                  'bg-warning-100 dark:bg-warning-900/30': goal.iconColor === 'warning',
                  'bg-error-100 dark:bg-error-900/30': goal.iconColor === 'error',
                }"
              >
                <Icon 
                  :name="goal.icon" 
                  class="w-5 h-5"
                  :class="{
                    'text-primary-600': goal.iconColor === 'primary',
                    'text-success-600': goal.iconColor === 'success',
                    'text-warning-600': goal.iconColor === 'warning',
                    'text-error-600': goal.iconColor === 'error',
                  }"
                />
              </div>
            </div>

            <!-- Title -->
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              {{ goal.title }}
            </h3>

            <!-- Progress -->
            <div class="mb-3">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-600 dark:text-gray-400">{{ $t('community.progress') }}</span>
                <span class="font-semibold text-primary-600 dark:text-primary-400">
                  {{ goal.progress }}%
                </span>
              </div>
              <UProgress v-model="goal.progress" size="sm" :aria-label="`${goal.title} progress: ${goal.progress}%`" />
            </div>

            <!-- Amount -->
            <div class="flex justify-between text-sm mb-4">
              <div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ $t('community.saved') }}</div>
                <div class="font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(goal.saved) }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ $t('community.goal') }}</div>
                <div class="font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(goal.target) }}
                </div>
              </div>
            </div>

            <!-- Likes -->
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Icon name="i-heroicons-heart-solid" class="w-4 h-4 text-error-500 mr-1" />
              <span>{{ goal.likes }} {{ $t('community.likes') }}</span>
            </div>
          </UCard>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <UButton size="lg" variant="outline" class="cursor-pointer px-4">
          {{ $t('community.exploreAll') }}
          <Icon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
        </UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 11.17 แก้ไขไฟล์ `app/components/Landing/Testimonials.vue` เพื่อเพิ่มการแปลภาษา
```vue
<script setup lang="ts">
const { $t } = useI18n()

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Entrepreneur',
    avatar: '👩‍💼',
    rating: 5,
    comment: 'DreamBuddy helped me save $50,000 for my business startup in just 18 months! The daily savings calculator kept me on track, and sharing my progress publicly motivated me to stay consistent.',
    goal: 'Business Startup',
    achieved: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Software Developer',
    avatar: '👨‍💻',
    rating: 5,
    comment: 'I love how simple and intuitive the app is. I\'ve been tracking 3 different goals simultaneously - emergency fund, vacation, and a new laptop. Already achieved 2 of them and counting for more!',
    goal: 'Emergency Fund + More',
    achieved: true
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Teacher',
    avatar: '👩‍🏫',
    rating: 5,
    comment: 'The community feature is amazing! Seeing others achieve their goals inspired me to start my own. I\'m halfway to my dream car now and feeling more motivated than ever thanks to DreamBuddy.',
    goal: 'Dream Car',
    achieved: false
  }
]
</script>

<template>
  <section id="testimonials" class="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <UBadge color="primary" variant="subtle" size="lg" class="mb-4">
          {{ $t('testimonials.badge') }}
        </UBadge>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {{ $t('testimonials.title') }}
          <span class="block bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {{ $t('testimonials.titleHighlight') }}
          </span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ $t('testimonials.subtitle') }}
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          class="group"
        >
          <UCard class="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="space-y-4">
              <!-- Rating -->
              <div class="flex items-center space-x-1">
                <Icon 
                  v-for="i in testimonial.rating" 
                  :key="i"
                  name="i-heroicons-star-solid" 
                  class="w-5 h-5 text-warning-400"
                />
              </div>

              <!-- Comment -->
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                "{{ testimonial.comment }}"
              </p>

              <!-- Goal Badge -->
              <div class="flex items-center space-x-2">
                <UBadge 
                  :color="testimonial.achieved ? 'success' : 'primary'" 
                  variant="subtle"
                >
                  {{ testimonial.goal }}
                </UBadge>
                <Icon 
                  v-if="testimonial.achieved"
                  name="i-heroicons-check-badge-solid" 
                  class="w-5 h-5 text-success-500"
                />
              </div>

              <!-- Author -->
              <div class="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div class="text-3xl">{{ testimonial.avatar }}</div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">
                    {{ testimonial.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ testimonial.role }}
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            4.9/5
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('testimonials.stats.rating') }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            10,000+
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('testimonials.stats.users') }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            85%
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('testimonials.stats.successRate') }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            $10M+
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('testimonials.stats.totalSaved') }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

##### 11.18 แก้ไขไฟล์ `app/components/Landing/CTA.vue` เพื่อเพิ่มการแปลภาษา
```vue
<script setup lang="ts">
const { $t } = useI18n()

const benefits = computed(() => [
  $t('cta.benefits.free'),
  $t('cta.benefits.unlimited'),
  $t('cta.benefits.tracking'),
  $t('cta.benefits.community')
])
</script>

<template>
  <section class="py-20 sm:py-32 bg-linear-to-br from-primary-600 via-blue-600 to-primary-700 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="max-w-4xl mx-auto">
        <!-- Main Content -->
        <div class="text-center mb-12">
          <!-- Icon -->
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Icon name="i-heroicons-sparkles" class="w-10 h-10 text-white" />
          </div>

          <!-- Headline -->
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            {{ $t('cta.title') }}
            <span class="block">{{ $t('cta.titleLine2') }}</span>
          </h2>

          <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {{ $t('cta.subtitle') }}
          </p>

          <!-- Benefits List -->
          <div class="grid sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
            <div 
              v-for="(benefit, index) in benefits" 
              :key="index"
              class="flex items-center space-x-3 text-left bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
            >
              <Icon name="i-heroicons-check-circle-solid" class="w-6 h-6 text-success-300 shrink-0" />
              <span class="text-white font-medium">{{ benefit }}</span>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <UButton 
              size="xl" 
              color="primary" 
              class="shadow-lg shadow-primary-500/50 px-4 cursor-pointer"
            >
              <Icon name="i-heroicons-rocket-launch" class="w-5 h-5" />
              {{ $t('cta.buttons.start') }}
            </UButton>
            <UButton 
              size="xl" 
              variant="outline"
              color="neutral"
              class="px-4 cursor-pointer"
            >
              <Icon name="i-heroicons-play-circle" class="w-5 h-5" />
              {{ $t('cta.buttons.demo') }}
            </UButton>
          </div>

          <!-- Social Proof -->
          <div class="mt-10 pt-10 border-t border-white/20">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div class="flex items-center space-x-2">
                <div class="flex -space-x-2">
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border-2 border-white/50">👨</div>
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border-2 border-white/50">👩</div>
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border-2 border-white/50">🧑</div>
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border-2 border-white/50">👧</div>
                </div>
                <div class="text-left">
                  <div class="text-white font-semibold">10,000+ {{ $t('cta.social.users') }}</div>
                  <div class="text-white/80 text-sm">{{ $t('cta.social.subtitle') }}</div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <div class="flex">
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                  <Icon name="i-heroicons-star-solid" class="w-5 h-5 text-warning-300" />
                </div>
                <div class="text-left">
                  <div class="text-white font-semibold">4.9/5 {{ $t('cta.social.rating') }}</div>
                  <div class="text-white/80 text-sm">{{ $t('cta.social.ratingSubtitle') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
```

> ทำการ commit และ checkout new branch
  git add .
  git commit -m "Implemented i18n for landing page components"
  git checkout -b dev-auth

## 12: Create Auth Layout

```
dreambuddy/
├─ app/
│  ├─ layouts/
│  │  ├─ auth.vue
```

##### 12.1 สร้างโฟลเดอร์ `app/layouts/Auth` และสร้างไฟล์ `auth.vue` ภายในโฟลเดอร์นั้น
```vue
<script setup lang="ts">
const { $t, $localePath } = useI18n()
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left Column - Background Image & Content -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-primary-600 via-primary-700 to-purple-700">
      <!-- Decorative Background -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <!-- Grid Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="grid grid-cols-8 gap-4 h-full">
              <div v-for="i in 64" :key="i" class="border border-white/20"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between p-12 text-white w-full">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <Icon name="i-heroicons-sparkles" class="w-10 h-10" />
          <span class="text-2xl font-bold">DreamBuddy</span>
        </div>

        <!-- Main Content -->
        <div class="space-y-6 max-w-md">
          <h1 class="text-4xl sm:text-5xl font-bold leading-tight">
            {{ $t('auth.leftPanel.title') }}
          </h1>
          <p class="text-lg text-primary-100">
            {{ $t('auth.leftPanel.subtitle') }}
          </p>
          
          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 pt-8">
            <div>
              <div class="text-3xl font-bold">10K+</div>
              <div class="text-sm text-primary-200">{{ $t('auth.leftPanel.stats.users') }}</div>
            </div>
            <div>
              <div class="text-3xl font-bold">50K+</div>
              <div class="text-sm text-primary-200">{{ $t('auth.leftPanel.stats.goals') }}</div>
            </div>
            <div>
              <div class="text-3xl font-bold">₿1M+</div>
              <div class="text-sm text-primary-200">{{ $t('auth.leftPanel.stats.saved') }}</div>
            </div>
          </div>
        </div>

        <!-- Footer Quote -->
        <div class="space-y-4">
          <blockquote class="text-lg italic text-primary-100">
            "{{ $t('auth.leftPanel.quote') }}"
          </blockquote>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="i-heroicons-user-circle" class="w-8 h-8" />
            </div>
            <div>
              <div class="font-semibold">Sarah Johnson</div>
              <div class="text-sm text-primary-200">{{ $t('auth.leftPanel.quoteAuthor') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Illustration Elements -->
      <div class="absolute top-1/4 right-12 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse"></div>
      <div class="absolute bottom-1/4 right-24 w-24 h-24 bg-white/10 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
    </div>

    <!-- Right Column - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-950">
      <div class="w-full max-w-md">
        <!-- Desktop - Back to Home + Language & Theme Switcher -->
        <div class="hidden lg:flex items-center justify-between mb-8">
          <NuxtLink
            :to="$localePath('/')"
            class="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
          >
            <Icon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
            {{ $t('auth.backToHome') }}
          </NuxtLink>
          
          <div class="flex items-center space-x-4">
            <AppLanguageSwitcher />
            <AppThemeToggle />
          </div>
        </div>

        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center space-x-2 mb-8">
          <Icon name="i-heroicons-sparkles" class="w-8 h-8 text-primary-600" />
          <span class="text-2xl font-bold bg-linear-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
            DreamBuddy
          </span>
        </div>

        <!-- Back to Homepage Button (Mobile) -->
        <div class="lg:hidden flex items-center justify-center mb-4">
          <NuxtLink
            :to="$localePath('/')"
            class="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
          >
            <Icon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
            {{ $t('auth.backToHome') }}
          </NuxtLink>
        </div>

        <!-- Language & Theme Switcher for Mobile -->
        <div class="lg:hidden flex items-center justify-center space-x-4 mb-8">
          <AppLanguageSwitcher />
          <AppThemeToggle />
        </div>

        <!-- Form Content (Slot) -->
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
```

## 13: Create Login Page

```dreambuddy/
├─ app/
│  ├─ pages/
│  │  ├─ auth/
│  │  │  ├─ login.vue
```

##### 13.1 สร้างโฟลเดอร์ `app/pages/auth` และสร้างไฟล์ `login.vue` ภายในโฟลเดอร์นั้น
```vue
<script setup lang="ts">
const { $t, $localePath } = useI18n()

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

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  // TODO: Implement login logic
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
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
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('auth.login.email') }}
        </label>
        <UInput
          id="email"
          v-model="email"
          type="email"
          :placeholder="String($t('auth.login.emailPlaceholder'))"
          size="lg"
          required
          autocomplete="email"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('auth.login.password') }}
        </label>
        <UInput
          id="password"
          v-model="password"
          type="password"
          :placeholder="String($t('auth.login.passwordPlaceholder'))"
          size="lg"
          required
          autocomplete="current-password"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            {{ $t('auth.login.rememberMe') }}
          </label>
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
    </form>

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

## 14: Create Register Page

```dreambuddy/
├─ app/
│  ├─ pages/
│  │  ├─ auth/
│  │  │  ├─ register.vue
```

##### 14.1 สร้างไฟล์ `register.vue` ภายในโฟลเดอร์ `app/pages/auth`
```vue
<script setup lang="ts">
const { $t, $localePath } = useI18n()

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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const isLoading = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    // TODO: Show error message
    console.error('Passwords do not match')
    return
  }
  
  if (!agreeTerms.value) {
    // TODO: Show error message
    console.error('Please agree to terms')
    return
  }

  isLoading.value = true
  // TODO: Implement register logic
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
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
    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('auth.register.name') }}
        </label>
        <UInput
          id="name"
          v-model="name"
          type="text"
          :placeholder="$t('auth.register.namePlaceholder') as string"
          size="lg"
          required
          autocomplete="name"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-user" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('auth.register.email') }}
        </label>
        <UInput
          id="email"
          v-model="email"
          type="email"
          :placeholder="$t('auth.register.emailPlaceholder') as string"
          size="lg"
          required
          autocomplete="email"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('auth.register.password') }}
        </label>
        <UInput
          id="password"
          v-model="password"
          type="password"
          :placeholder="$t('auth.register.passwordPlaceholder') as string"
          size="lg"
          required
          autocomplete="new-password"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('auth.register.confirmPassword') }}
        </label>
        <UInput
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          :placeholder="$t('auth.register.confirmPasswordPlaceholder') as string"
          size="lg"
          required
          autocomplete="new-password"
          class="w-full"
        >
          <template #leading>
            <Icon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </div>

      <!-- Terms & Conditions -->
      <div class="flex items-start">
        <input
          id="agree-terms"
          v-model="agreeTerms"
          type="checkbox"
          class="h-4 w-4 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          required
        />
        <label for="agree-terms" class="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          {{ $t('auth.register.agreeToTerms') }}
          <NuxtLink :to="$localePath('/terms')" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            {{ $t('auth.register.termsOfService') }}
          </NuxtLink>
          {{ $t('auth.register.and') }}
          <NuxtLink :to="$localePath('/privacy')" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            {{ $t('auth.register.privacyPolicy') }}
          </NuxtLink>
        </label>
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
        {{ $t('auth.register.createAccount') }}
      </UButton>
    </form>

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

## 15: Create Forgot Password Page

```dreambuddy/
├─ app/
│  ├─ pages/
│  │  ├─ auth/
│  │  │  ├─ forgot-password.vue
```

##### 15.1 สร้างไฟล์ `forgot-password.vue` ภายในโฟลเดอร์ `app/pages/auth`
```vue
<script setup lang="ts">
const { $t, $localePath } = useI18n()

definePageMeta({
  layout: 'auth'
})

useHead({
  title: $t('auth.forgotPassword.title') as string,
  meta: [
    {
      name: 'description',
      content: $t('auth.forgotPassword.subtitle') as string
    }
  ]
})

const email = ref('')
const isLoading = ref(false)
const isEmailSent = ref(false)

const handleResetPassword = async () => {
  isLoading.value = true
  // TODO: Implement reset password logic
  setTimeout(() => {
    isLoading.value = false
    isEmailSent.value = true
  }, 1000)
}

const handleResendEmail = () => {
  isEmailSent.value = false
  email.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <!-- Success State -->
    <div v-if="isEmailSent" class="text-center space-y-6">
      <!-- Icon -->
      <div class="mx-auto w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
        <Icon name="i-heroicons-envelope" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
      </div>

      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t('auth.forgotPassword.checkEmail') }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ $t('auth.forgotPassword.emailSent') }} <span class="font-medium text-gray-900 dark:text-white">{{ email }}</span>
        </p>
      </div>

      <!-- Instructions -->
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-left">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t('auth.forgotPassword.instructions') }}
        </p>
      </div>

      <!-- Actions -->
      <div class="space-y-3">
        <UButton
          block
          size="lg"
          color="primary"
          @click="$router.push($localePath('/auth/login'))"
          class="cursor-pointer"
        >
          {{ $t('auth.forgotPassword.backToLogin') }}
        </UButton>
        <UButton
          block
          size="lg"
          variant="ghost"
          @click="handleResendEmail"
          class="cursor-pointer"
        >
          {{ $t('auth.forgotPassword.resendEmail') }}
        </UButton>
      </div>
    </div>

    <!-- Form State -->
    <div v-else>
      <!-- Header -->
      <div class="text-center lg:text-left">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t('auth.forgotPassword.title') }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ $t('auth.forgotPassword.subtitle') }}
        </p>
      </div>

      <!-- Reset Form -->
      <form @submit.prevent="handleResetPassword" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('auth.forgotPassword.email') }}
          </label>
          <UInput
            id="email"
            v-model="email"
            type="email"
            :placeholder="$t('auth.forgotPassword.emailPlaceholder') as string"
            size="lg"
            required
            autocomplete="email"
            class="w-full"
          >
            <template #leading>
              <Icon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400" />
            </template>
          </UInput>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ $t('auth.forgotPassword.emailHint') }}
          </p>
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
          {{ $t('auth.forgotPassword.sendResetLink') }}
        </UButton>
      </form>

      <!-- Back to Login -->
      <div class="text-center mt-4">
        <NuxtLink
          :to="$localePath('/auth/login')"
          class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <Icon name="i-heroicons-arrow-left" class="w-4 h-4 mr-1" />
          {{ $t('auth.forgotPassword.backToLogin') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

```

## 16: Persist Language Selection
```dreambuddy/
├─ app/
│  ├─ app.vue
```

##### 16.1 แก้ไขไฟล์ `app/app.vue` เพื่อโหลดภาษาจาก localStorage เมื่อแอพเริ่มต้น
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
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

##### 16.2 ทดสอบการทำงานโดยรันคำสั่ง
```
bun run dev
```

> ทำการ commit และ checkout new branch
  git add .
  git commit -m "Created auth layout and pages with i18n support"
  git checkout -b dev-prisma


## 17: Setup Prisma and PostgreSQL
```dreambuddy/
├─ prisma/
│  ├─ schema.prisma
│  ├─ seed.ts
├─ .env
```
##### 17.1 เตรียมฐานข้อมูล PostgreSQL
- สามารถใช้บริการฐานข้อมูล PostgreSQL ฟรี เช่น 
- [Supabase](https://supabase.com/)
- [Prisma Postgres](https://www.prisma.io/postgres)
- [Neon](https://neon.com/)
- สร้างฐานข้อมูลใหม่ชื่อ "dreambuddydb" และจดจำ connection string ที่ได้มา เช่น
```
# Local PostgreSQL database connection string
DATABASE_URL="postgresql://postgres:123456@localhost:5432/dreambuddydb?schema=public"

# Prisma.io Data Platform connection string
DATABASE_URL="postgres://username:password@db.prisma.io:5432/postgres?sslmode=require&pool=true"
```
- กรณีสร้างฐานข้อมูลบนเครื่องตัวเอง ให้ติดตั้ง PostgreSQL และสร้างฐานข้อมูล "dreambuddydb" ด้วยคำสั่ง
```sql
CREATE DATABASE dreambuddydb;
```

##### 17.2 ติดตั้ง Prisma CLI และไลบรารีที่เกี่ยวข้อง
```bash
bun add -d prisma@6.19.0
bun add @prisma/client@6.19.0
```

##### 17.3 ทำการ initial prisma ใน project nuxt
```bash
bun prisma init
```
##### 17.4 แก้ไขไฟล์ `.env` เพื่อเพิ่มตัวแปร `DATABASE_URL` สำหรับเชื่อมต่อกับฐานข้อมูล PostgreSQL

```env
# Local PostgreSQL database connection string
DATABASE_URL="postgresql://postgres:123456@localhost:5432/dreambuddydb?schema=public"

# Prisma.io Data Platform connection string
DATABASE_URL="postgres://username:password@db.prisma.io:5432/postgres?sslmode=require&pool=true"
```

<image src="https://www.itgenius.co.th/assets/frondend/images/course_detail/devopsjenkins/dreambuddy-db-diagram.jpg" alt="DreamBuddy Database Schema Diagram"/>

##### 17.5 แก้ไขไฟล์ `prisma/schema.prisma` เพื่อกำหนดฐานข้อมูล PostgreSQL และสร้างโมเดล User
```prisma
// schema.prisma สำหรับ DreamBuddy
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


// -----------------------------
// ENUMS
// -----------------------------

// โหมดการมองเห็นเป้าหมาย
enum GoalVisibility {
  PRIVATE   // เห็นได้เฉพาะเจ้าของ
  PUBLIC    // แสดงใน Explore / โปรไฟล์
  LINK_ONLY // เข้าถึงได้เฉพาะคนที่มีลิงก์
}

// ประเภทของรายการเงินเคลื่อนไหว
enum TransactionType {
  DEPOSIT   // ออมเพิ่ม
  WITHDRAW  // ถอนออก (กรณีพิเศษ)
}

// -----------------------------
// MODELS หลัก
// -----------------------------

model User {
  id           Int       @id @default(autoincrement())
  name         String?
  username     String    @unique             // ใช้สำหรับ URL โปรไฟล์ /user/:username
  email        String    @unique
  passwordHash String?                       // ถ้าใช้ OAuth อย่างเดียว อาจเป็น null
  provider     String?                       // เช่น "google", "github"
  providerId   String?                       // id จาก provider ภายนอก
  avatarUrl    String?
  bio          String?
  goals        Goal[]
  transactions Transaction[]
  comments     GoalComment[]
  likes        GoalLike[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([username])
  @@index([email])
}

// เป้าหมายการเก็บเงินแต่ละรายการ
model Goal {
  id            Int             @id @default(autoincrement())
  title         String
  note          String?
  category      String?                         // เช่น Travel, Gadget, Education
  imageUrl      String?
  targetAmount  Decimal         @db.Decimal(12, 2)
  savedAmount   Decimal         @db.Decimal(12, 2) @default(0)
  targetDate    DateTime
  visibility    GoalVisibility  @default(PRIVATE)
  shareSlug     String?         @unique          // สำหรับแชร์ลิงก์แบบ LINK_ONLY เช่น dreambuddy.app/g/:slug
  likesCount    Int             @default(0)      // cache จำนวน like
  ownerId       Int
  owner         User            @relation(fields: [ownerId], references: [id])
  transactions  Transaction[]
  comments      GoalComment[]
  likes         GoalLike[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  @@index([ownerId])
  @@index([visibility])
  @@index([category])
}

// รายการการออม/ถอนเงินในแต่ละเป้าหมาย
model Transaction {
  id        Int             @id @default(autoincrement())
  goalId    Int
  goal      Goal            @relation(fields: [goalId], references: [id])
  userId    Int?                               // เผื่ออนาคตมีหลายคนออมร่วมกัน
  user      User?           @relation(fields: [userId], references: [id])
  amount    Decimal         @db.Decimal(12, 2) // จำนวนเงิน (+/- ขึ้นกับ type)
  type      TransactionType @default(DEPOSIT)
  note      String?
  createdAt DateTime        @default(now())

  @@index([goalId])
  @@index([userId])
}

// การกดถูกใจเป้าหมาย (ให้กำลังใจ)
model GoalLike {
  userId Int
  goalId Int
  user   User @relation(fields: [userId], references: [id])
  goal   Goal @relation(fields: [goalId], references: [id])
  createdAt DateTime @default(now())

  @@id([userId, goalId]) // หนึ่งคนกด like เป้าหมายหนึ่งได้ครั้งเดียว
  @@index([goalId])
}

// คอมเมนต์ให้กำลังใจหรือแสดงความคิดเห็นบนเป้าหมาย
model GoalComment {
  id        Int      @id @default(autoincrement())
  goalId    Int
  goal      Goal     @relation(fields: [goalId], references: [id])
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  content   String   // ข้อความคอมเมนต์
  createdAt DateTime @default(now())

  @@index([goalId])
  @@index([userId])
}
```

##### 17.6 สร้างไฟล์ `prisma.config.ts` ที่ root project เพื่อกำหนดพาธของ Prisma Client (สำหรับ Prisma v5 ขึ้นไป)
```ts
import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun run prisma/seed.ts",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
})
```

##### 17.7 ตรวจสอบความถูกต้องของ schema.prisma
```bash
bun prisma validate
```

##### 17.8 รันคำสั่งเพื่อสร้างตารางในฐานข้อมูลตามโมเดลที่กำหนดใน schema.prisma
```bash
bun prisma migrate dev --name init
```

##### 17.9 สร้างไฟล์ `prisma/seed.ts` เพื่อเพิ่มข้อมูลตัวอย่าง (seed data) ลงในฐานข้อมูล
```ts
import { PrismaClient } from '../app/generated/prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // -------------------------------
  // 1) สร้าง Users ตัวอย่าง 10 คน
  // -------------------------------
  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          username: `user${i + 1}`,
          email: `user${i + 1}@mail.com`,
          passwordHash: 'password123',
          bio: 'Just a sample user for DreamBuddy seeding.',
          avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=user${i + 1}`
        }
      })
    )
  )

  // -------------------------------
  // 2) สร้าง Goals ตัวอย่าง 10 รายการ
  // -------------------------------
  const sampleGoals = [
    'เที่ยวญี่ปุ่น',
    'ซื้อ iPad ใหม่',
    'เก็บเงินแต่งบ้าน',
    'ซื้อจักรยานไฟฟ้า',
    'ตั้งกองทุนสำรองเลี้ยงชีพ',
    'ไปเรียนคอร์สออนไลน์',
    'เก็บเงินแต่งงาน',
    'ซื้อ MacBook Pro',
    'เก็บเงินสำรองฉุกเฉิน',
    'ทริปภาคเหนือ'
  ]

  const goals = await Promise.all(
    sampleGoals.map((title, i) =>
      prisma.goal.create({
        data: {
          title,
          note: 'ตัวอย่างเป้าหมายเก็บเงิน',
          category: ['Travel', 'Gadget', 'Education', 'Life'][i % 4],
          imageUrl: null,
          targetAmount: 10000 + i * 5000,
          savedAmount: 0,
          targetDate: new Date(Date.now() + (i + 1) * 86400000 * 30),
          visibility: i % 3 === 0 ? 'PUBLIC' : 'PRIVATE',
          shareSlug: i % 3 === 2 ? randomUUID() : null,
          ownerId: users[i % 10].id
        }
      })
    )
  )

  // -------------------------------
  // 3) สร้าง Transactions ตัวอย่าง
  // -------------------------------
  await Promise.all(
    goals.map((goal) =>
      prisma.transaction.create({
        data: {
          amount: 500,
          type: 'DEPOSIT',
          note: 'เริ่มต้นออมงวดแรก',
          goalId: goal.id,
          userId: goal.ownerId
        }
      })
    )
  )

  // -------------------------------
  // 4) สร้าง Likes ตัวอย่าง (สุ่ม)
  // -------------------------------
  const likes = []
  for (let i = 0; i < goals.length; i++) {
    const goal = goals[i]
    const randomUser = users[i % users.length] // ใช้ modulo เพื่อไม่ให้ซ้ำกัน
    try {
      likes.push(
        prisma.goalLike.create({
          data: {
            goalId: goal.id,
            userId: randomUser.id
          }
        })
      )
    } catch (error) {
      // Skip if duplicate
    }
  }
  await Promise.all(likes)

  // -------------------------------
  // 5) สร้าง Comments ตัวอย่าง
  // -------------------------------
  const comments = [
    'สุดยอดเลยครับ!',
    'เป็นกำลังใจให้นะ',
    'ไปให้ถึงเป้าหมายครับ',
    'ขอให้สำเร็จเร็ว ๆ ครับ!',
    'ติดตามอยู่ครับ',
    'เยี่ยมมาก',
    'ไอเดียดีมากครับ',
    'ผมก็อยากทำแบบนี้',
    'สุดยอดจริง ๆ',
    'ขอแชร์ไอเดียนี้นะครับ'
  ]

  await Promise.all(
    goals.map((goal, i) =>
      prisma.goalComment.create({
        data: {
          goalId: goal.id,
          userId: users[i % users.length].id,
          content: comments[i]
        }
      })
    )
  )

  console.log('🌱 Seeding completed!')
}

// เรียกใช้งาน seed
main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```


##### 17.10 รันคำสั่งเพื่อเพิ่มข้อมูลตัวอย่างลงในฐานข้อมูล
```bash
bun prisma db seed
```

> ทำการ commit และ checkout new branch
  git add .
  git commit -m "Setup Prisma with PostgreSQL and seed data"
  git checkout -b dev-rest-api
