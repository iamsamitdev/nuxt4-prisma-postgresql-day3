<script setup lang="ts">
    const route = useRoute()
    const productId = route.params.id

    useHead({
        title: `Product ${productId} - My Nuxt 4 Application`,
        meta: [
            { name: 'description', content: `This is the detail page for product ${productId} of our Nuxt 4 application.` }
        ],
    })
</script>

<template>
    <div>
        <h1>Product Detail</h1>
        <p>This is the detail page for product {{ productId }}</p>
    </div>
</template>

<style scoped>

</style>