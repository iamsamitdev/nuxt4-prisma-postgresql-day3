<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'auth'
})

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  targetAmount: z.number().positive('Amount must be positive'),
  targetDate: z.string().refine((date) => new Date(date) > new Date(), 'Date must be in the future'),
  category: z.string().optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC', 'LINK_ONLY']),
  note: z.string().optional(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal(''))
})

type Schema = z.output<typeof schema>

const state = reactive({
  title: '',
  targetAmount: 0,
  targetDate: '',
  category: 'General',
  visibility: 'PRIVATE' as const,
  note: '',
  imageUrl: ''
})

const categories = ['General', 'Travel', 'Gadget', 'Education', 'Vehicle', 'Home', 'Emergency Fund', 'Investment']
const visibilities = [
  { label: 'Private', value: 'PRIVATE' },
  { label: 'Public', value: 'PUBLIC' },
  { label: 'Link Only', value: 'LINK_ONLY' }
]

const loading = ref(false)
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $fetch('/api/goals', {
      method: 'POST',
      body: event.data
    })
    toast.add({ title: 'Success', description: 'Goal created successfully' })
    navigateTo('/goals')
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to create goal', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <div class="mb-6">
      <UButton to="/goals" variant="ghost" icon="i-heroicons-arrow-left">Back to Goals</UButton>
      <h1 class="text-2xl font-bold mt-2">Create New Goal</h1>
    </div>

    <UCard>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Goal Title" name="title" required>
          <UInput v-model="state.title" placeholder="e.g. Dream Vacation" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Target Amount" name="targetAmount" required>
            <UInput v-model.number="state.targetAmount" type="number" placeholder="0.00" class="w-full" />
          </UFormField>

          <UFormField label="Target Date" name="targetDate" required>
            <UInput v-model="state.targetDate" type="date" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Category" name="category">
          <USelect v-model="state.category" :items="categories" class="w-full" />
        </UFormField>

        <UFormField label="Visibility" name="visibility">
          <URadioGroup v-model="state.visibility" :items="visibilities" />
        </UFormField>

        <UFormField label="Image URL (Optional)" name="imageUrl">
          <UInput v-model="state.imageUrl" placeholder="https://..." class="w-full" />
        </UFormField>

        <UFormField label="Note" name="note">
          <UTextarea v-model="state.note" placeholder="Why do you want to save for this?" class="w-full" />
        </UFormField>

        <div class="flex justify-end pt-4">
          <UButton type="submit" color="primary" :loading="loading">
            Create Goal
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>