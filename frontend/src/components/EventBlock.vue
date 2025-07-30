<script setup>
defineProps({
  categoryName: {
    type: String,
    default: '未分類',
  },
  time: {
    type: String,
    default: '時間未定',
  },
})
</script>

<template>
  <div class="absolute inset-x-0 bg-blue-200 opacity-75 z-10 p-2 rounded flex items-center">
    <div class="flex items-center justify-between w-full">
      <p class="font-bold text-sm truncate">{{ categoryName }}</p>
      <p class="text-xs flex-shrink-0 ml-2">{{ time }}</p>
    </div>
  </div>
</template>
