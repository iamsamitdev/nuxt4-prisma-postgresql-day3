<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { $t, $localePath } = useI18n()
const toast = useToast()

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
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