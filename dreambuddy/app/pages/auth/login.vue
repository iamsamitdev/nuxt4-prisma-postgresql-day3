<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { $t, $localePath } = useI18n()
const toast = useToast()
const router = useRouter()

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
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