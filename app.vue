<template>
  <div class="min-h-screen bg-cream-100 dark:bg-night-900 transition-colors duration-300">
    <NuxtPage />
  </div>
</template>

<script setup>
// Initialize color mode on app mount
const { colorMode } = useColorMode()
</script>
