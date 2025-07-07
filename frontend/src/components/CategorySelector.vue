<script setup>
import { ref } from 'vue'
// 仮のカテゴリデータ
const categories = ref([
  { name: '睡眠', icon: ['fas', 'bed'] },
  { name: '食事', icon: ['fas', 'utensils'] },
  { name: 'お風呂', icon: ['fas', 'bath'] },
  { name: '移動', icon: ['fas', 'train'] },
  { name: '仕事', icon: ['fas', 'briefcase'] },
  { name: '学校', icon: ['fas', 'school'] },
  { name: '勉強', icon: ['fas', 'book-open'] },
  { name: 'スマホ', icon: ['fas', 'mobile-alt'] },
  { name: 'PC', icon: ['fas', 'laptop'] },
  { name: '遊ぶ', icon: ['fas', 'music'] },
  { name: 'ゲーム', icon: ['fas', 'gamepad'] },
  { name: 'TV', icon: ['fas', 'tv'] },
  { name: '映画', icon: ['fas', 'film'] },
  { name: '読書', icon: ['fas', 'book'] },
  { name: 'スポーツ', icon: ['fas', 'futbol'] },
  { name: '買い物', icon: ['fas', 'shopping-cart'] },
  { name: 'カフェ', icon: ['fas', 'mug-saucer'] },
  { name: '飲み会', icon: ['fas', 'beer-mug-empty'] },
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
