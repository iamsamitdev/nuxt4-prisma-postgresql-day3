<script setup lang="ts">

useHead({
  title: 'Explore Dreams - DreamBuddy',
  meta: [
    { 
      name: 'description', 
      content: 'See what others are saving for and get inspired by their goals on DreamBuddy.' 
    }
  ]
})

definePageMeta({
  auth: false // Allow public access
})

const { data: goals } = await useFetch('/api/explore/goals')

const getProgress = (saved: number, target: number) => {
  if (target === 0) return 0
  return Math.min(100, Math.round((saved / target) * 100))
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Explore Dreams</h1>
      <p class="text-gray-600">See what others are saving for and get inspired.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="goal in goals" :key="goal.id" class="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
        <template #header>
          <div class="flex items-center gap-3">
            <UAvatar :src="goal.owner?.avatarUrl ?? undefined" :alt="goal.owner?.username" size="sm" />
            <div class="overflow-hidden">
              <p class="text-sm font-medium truncate">{{ goal.owner?.name || goal.owner?.username }}</p>
              <p class="text-xs text-gray-500 truncate">@{{ goal.owner?.username }}</p>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <h3 class="font-bold text-lg truncate">{{ goal.title }}</h3>
          
          <div class="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span class="font-medium text-primary">{{ getProgress(Number(goal.savedAmount), Number(goal.targetAmount)) }}%</span>
          </div>
          <UProgress :model-value="getProgress(Number(goal.savedAmount), Number(goal.targetAmount))" size="sm" />
          
          <div class="flex justify-between items-end pt-2">
            <div>
               <p class="text-xs text-gray-500">Goal</p>
               <p class="font-semibold">{{ Number(goal.targetAmount).toLocaleString() }}</p>
            </div>
            <div class="flex items-center gap-1 text-red-500">
               <UIcon name="i-heroicons-heart" />
               <span class="text-sm">{{ goal.likesCount || 0 }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>