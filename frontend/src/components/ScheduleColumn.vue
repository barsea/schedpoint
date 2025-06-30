<template>
  <div class="relative">
    <h2 class="flex items-center justify-center h-16 text-3xl border-b-2 border-slate-300">
      {{ title }}
    </h2>
    <div v-for="n in 24" :key="n" class="h-12 pr-2 border-b border-gray-200"></div>

    <EventBlock :style="{ top: '208px', height: '48px' }" />
  </div>
</template>

<script setup>
import EventBlock from './EventBlock.vue'

defineProps({
  title: String,
})
</script>

<style scoped></style>
