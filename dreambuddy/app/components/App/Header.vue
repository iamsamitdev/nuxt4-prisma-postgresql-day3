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