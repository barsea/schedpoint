<template>
  <div>
    <h2 class="flex items-center justify-center h-16 text-3xl border-b-2 border-slate-300">{{ title }}</h2>
  </div>
  <div
      v-for="n in 24"
      :key="n"
      class="relative h-12 pr-2 border-b border-gray-200"
    ></div>
</template>

<script setup>
  defineProps({
    title: String
  })
</script>

<style scoped>
</style>
