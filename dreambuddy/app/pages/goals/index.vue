<script setup lang="ts">

useHead({
  title: 'My Goals',
  meta: [
    {
      name: 'description',
      content: 'View and manage your personal goals.'
    }
  ]
})

definePageMeta({
  middleware: 'auth'
})

const { data: goals, refresh } = await useFetch('/api/goals')

const getProgress = (saved: number, target: number) => {
  if (target === 0) return 0
  return Math.min(100, Math.round((saved / target) * 100))
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">My Goals</h1>
      <UButton to="/goals/create" icon="i-heroicons-plus" color="primary">
        New Goal
      </UButton>
    </div>

    <div v-if="goals?.length === 0" class="text-center py-12 text-gray-500">
      <p>You don't have any goals yet.</p>
      <UButton to="/goals/create" variant="link" class="mt-2">Create one now</UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="goal in goals" :key="goal.id" class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo(`/goals/${goal.id}`)">
        <template #header>
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold">{{ goal.title }}</h3>
              <p class="text-sm text-gray-500">{{ goal.category || 'Uncategorized' }}</p>
            </div>
            <UBadge :color="goal.visibility === 'PRIVATE' ? 'neutral' : goal.visibility === 'PUBLIC' ? 'success' : 'warning'" size="xs">
              {{ goal.visibility }}
            </UBadge>
          </div>
        </template>

        <div class="space-y-4">
          <div v-if="goal.imageUrl" class="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img :src="goal.imageUrl" alt="Goal image" class="w-full h-full object-cover" />
          </div>
          
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span class="font-medium">{{ getProgress(Number(goal.savedAmount), Number(goal.targetAmount)) }}%</span>
            </div>
            <UProgress :model-value="getProgress(Number(goal.savedAmount), Number(goal.targetAmount))" color="primary" />
          </div>

          <div class="flex justify-between text-sm">
            <div>
              <p class="text-gray-500">Saved</p>
              <p class="font-semibold">{{ Number(goal.savedAmount).toLocaleString() }}</p>
            </div>
            <div class="text-right">
              <p class="text-gray-500">Target</p>
              <p class="font-semibold">{{ Number(goal.targetAmount).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>