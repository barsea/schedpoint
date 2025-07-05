<script setup>
import { ref } from 'vue'

const items = ref([
  '',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
])
</script>

<template>
  <div>
    <div class="h-16 border-b-2 border-slate-300"></div>
    <div v-for="(text, index) in items" :key="index" class="relative h-12 pr-2 text-right">
      <span class="relative text-sm text-gray-500 -top-[13px]">
        {{ text }}
      </span>    
    </div>
  </div>    
</template>

<style scoped></style>
