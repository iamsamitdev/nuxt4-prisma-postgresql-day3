<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'auth' // Or custom middleware to allow public access if public
})

const { $t } = useI18n()
const route = useRoute()
const goalId = route.params.id

// Fetch goal details
const { data: goal, refresh: refreshGoal, error } = await useFetch(`/api/goals/${goalId}`)
const { data: transactions, refresh: refreshTransactions } = await useFetch(`/api/goals/${goalId}/transactions`)

// Transaction Form
const isDepositModalOpen = ref(false)
const transactionSchema = z.object({
  amount: z.number({
    message: String($t('goals.transaction.amountInvalid') || 'Amount must be a number')
  }).positive(String($t('goals.transaction.amountPositive') || 'Amount must be positive')),
  type: z.enum(['DEPOSIT', 'WITHDRAW'], {
    message: String($t('goals.transaction.typeRequired') || 'Type is required')
  }),
  note: z.string().optional()
})
type TransactionSchema = z.output<typeof transactionSchema>

const transactionState = reactive({
  amount: 0,
  type: 'DEPOSIT' as const,
  note: ''
})

const transactionTypes = computed(() => [
  { value: 'DEPOSIT', label: String($t('goals.transaction.deposit') || 'Deposit (Save)') },
  { value: 'WITHDRAW', label: String($t('goals.transaction.withdraw') || 'Withdraw') }
])

const loading = ref(false)
const toast = useToast()

async function onTransactionSubmit(event: FormSubmitEvent<TransactionSchema>) {
  loading.value = true
  try {
    await $fetch(`/api/goals/${goalId}/transactions`, {
      method: 'POST',
      body: event.data
    })
    toast.add({ 
      title: String($t('goals.transaction.successTitle') || 'Success'), 
      description: String($t('goals.transaction.successMessage') || 'Transaction recorded'),
      color: 'success'
    })
    isDepositModalOpen.value = false
    transactionState.amount = 0
    transactionState.note = ''
    refreshGoal()
    refreshTransactions()
  } catch (err: any) {
    toast.add({ 
      title: String($t('goals.transaction.errorTitle') || 'Error'), 
      description: err.data?.statusMessage || err.message || String($t('goals.transaction.errorMessage') || 'Failed to record transaction'), 
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}

const getProgress = (saved: number, target: number) => {
  if (!target) return 0
  return Math.min(100, Math.round((saved / target) * 100))
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

const copyLink = () => {
  const shareUrl = `${window.location.origin}/goals/share/${goal.value?.shareSlug}`
  navigator.clipboard.writeText(shareUrl)
  toast.add({ title: 'Link copied!', description: 'Share link copied to clipboard' })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="error" class="text-center text-red-500">
      {{ error.statusMessage || 'Error loading goal' }}
    </div>

    <div v-else-if="goal" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Goal Info -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between">
          <UButton to="/goals" variant="ghost" icon="i-heroicons-arrow-left">Back</UButton>
          <div class="flex gap-2">
             <UBadge :color="goal.visibility === 'PRIVATE' ? 'neutral' : 'success'">{{ goal.visibility }}</UBadge>
             <UButton v-if="goal.visibility === 'LINK_ONLY'" icon="i-heroicons-link" variant="ghost" color="neutral" @click="copyLink" />
          </div>
        </div>

        <UCard>
          <div class="flex flex-col md:flex-row gap-6">
            <div v-if="goal.imageUrl" class="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img :src="goal.imageUrl" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <h1 class="text-3xl font-bold mb-2">{{ goal.title }}</h1>
              <p class="text-gray-500 mb-4">{{ goal.category }}</p>
              <p v-if="goal.note" class="text-gray-700 mb-4">{{ goal.note }}</p>
              
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="font-medium">Progress ({{ getProgress(Number(goal.savedAmount), Number(goal.targetAmount)) }}%)</span>
                  <span class="text-gray-500">Target Date: {{ formatDate(goal.targetDate) }}</span>
                </div>
                <UProgress :model-value="getProgress(Number(goal.savedAmount), Number(goal.targetAmount))" size="lg" />
                <div class="flex justify-between items-end mt-2">
                  <div>
                    <p class="text-sm text-gray-500">Saved</p>
                    <p class="text-2xl font-bold text-primary">{{ Number(goal.savedAmount).toLocaleString() }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Target</p>
                    <p class="text-xl font-semibold">{{ Number(goal.targetAmount).toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <template #footer>
             <div class="flex justify-end">
                <UButton icon="i-heroicons-plus" size="lg" @click="isDepositModalOpen = true">Add Savings</UButton>
             </div>
          </template>
        </UCard>

        <!-- Transactions History -->
        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">History</h2>
          <UCard v-if="transactions?.length">
              <div v-for="tx in transactions" :key="tx.id" class="py-3 flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div :class="`py-2 px-3 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`">
                    <UIcon :name="tx.type === 'DEPOSIT' ? 'i-heroicons-arrow-up' : 'i-heroicons-arrow-down'" />
                  </div>
                  <div>
                    <p class="font-medium">{{ tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdraw' }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(tx.createdAt) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p :class="`font-bold ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`">
                    {{ tx.type === 'DEPOSIT' ? '+' : '-' }}{{ Number(tx.amount).toLocaleString() }}
                  </p>
                  <p v-if="tx.note" class="text-xs text-gray-500">{{ tx.note }}</p>
                </div>
              </div>
          </UCard>
          <div v-else class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No transactions yet.
          </div>
        </div>
      </div>

      <!-- Right Column: Stats / Social (Placeholder) -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h3 class="font-semibold">Details</h3>
          </template>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Created</span>
              <span>{{ formatDate(goal.createdAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Owner</span>
              <span>{{ goal.owner?.name || goal.owner?.username }}</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <UModal v-model:open="isDepositModalOpen" :title="String($t('goals.transaction.addTransaction') || 'Add Transaction')">
      <template #body>
        <UForm :schema="transactionSchema" :state="transactionState" @submit="onTransactionSubmit" class="space-y-4">
          <UFormField :label="String($t('goals.transaction.type') || 'Type')" name="type">
            <URadioGroup v-model="transactionState.type" :items="transactionTypes" />
          </UFormField>

          <UFormField :label="String($t('goals.transaction.amount') || 'Amount')" name="amount" required>
            <UInput v-model.number="transactionState.amount" type="number" placeholder="0.00" autofocus />
          </UFormField>

          <UFormField :label="String($t('goals.transaction.note') || 'Note')" name="note">
            <UInput v-model="transactionState.note" :placeholder="String($t('goals.transaction.notePlaceholder') || 'Optional note')" />
          </UFormField>

          <div class="flex justify-end gap-2 mt-4">
            <UButton color="neutral" variant="ghost" @click="isDepositModalOpen = false">{{ $t('common.cancel') || 'Cancel' }}</UButton>
            <UButton type="submit" color="primary" :loading="loading">{{ $t('common.save') || 'Save' }}</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>