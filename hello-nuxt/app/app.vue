<script setup lang="ts">
  useHead({
    htmlAttrs: {
      lang: 'en',
    },
    title: 'My Nuxt 4 Application',
    meta: [
      { name: 'description', content: 'This is a sample Nuxt 4 application.' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
