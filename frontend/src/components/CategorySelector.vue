<script setup>
import { ref } from 'vue'
// 仮のカテゴリデータ
const categories = ref([
  { name: '睡眠', icon: ['fas', 'bed'] },
  { name: '食事', icon: ['fas', 'utensils'] },
  { name: 'スマホ', icon: ['fas', 'mobile-alt'] },
  { name: 'PC', icon: ['fas', 'laptop'] },
  { name: 'ゲーム', icon: ['fas', 'gamepad'] },
  { name: '勉強', icon: ['fas', 'book-open'] },
  { name: 'お風呂', icon: ['fas', 'bath'] },
])
</script>

<template>
  <div>
    <label class="text-gray-700 text-sm font-bold mb-2">カテゴリ</label>
    <div class="grid grid-cols-6 gap-8">
      <div
        v-for="cat in categories"
        :key="cat.name"
        class="flex flex-col items-center p-3 border rounded-lg cursor-pointer"
      >
        <font-awesome-icon :icon="cat.icon" class="text-3xl mb-1" />
        <span class="text-sm text-center font-medium">{{ cat.name }}</span>
      </div>
    </div>
  </div>
</template>
