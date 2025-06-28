<template>
  <div>
    <h2 class="h-16 text-center text-3xl border-b-2 border-slate-300 ">{{ title }}</h2>
  </div>
</template>

<script setup>
  defineProps({
    title: String
  })
</script>

<style scoped>
</style>
