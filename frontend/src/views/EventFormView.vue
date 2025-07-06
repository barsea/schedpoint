<script setup>
import CategorySelector from '@/components/CategorySelector.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 class="text-2xl font-bold text-center mb-6">イベント作成</h1>
      <CategorySelector />
    </div>
  </div>
</template>

<style scoped></style>
