<script setup lang="ts">

  // definePageMeta({
  //   middleware: 'auth' // ใช้ middleware auth ที่สร้างขึ้น
  // })

  useHead({
    title: 'DreamBuddy - Turn Your Dreams Into Reality',
    meta: [
      { 
        name: 'description', 
        content: 'Track your savings goals, share with the community, and turn your dreams into reality. Join thousands of users saving smarter with DreamBuddy.' 
      }
    ]
  })
</script>

<template>
  <div>
    <!-- Hero Section -->
    <LandingHero />

    <!-- Features Section -->
    <LandingFeature />

    <!-- How It Works Section -->
    <LandingHowitwork />

    <!-- Community Goals Section -->
    <LandingComunity />

    <!-- Testimonials Section -->
    <LandingTestimonials />

    <!-- Call to Action Section -->
    <LandingCTA />
  </div>
</template>