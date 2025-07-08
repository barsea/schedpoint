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
const selectedCategory = ref('')
// カテゴリがクリックされたときの処理
const selectCategory = (categoryName) => {
  // 既に選択されている場合は選択を解除、そうでない場合は選択
  selectedCategory.value = selectedCategory.value === categoryName ? '' : categoryName
}
</script>

<template>
  <div>
    <label class="block text-gray-700 text-sm font-bold mb-2">カテゴリ</label>
    <div class="grid grid-cols-6 gap-8">
      <div
        v-for="category in categories"
        :key="category.name"
        class="flex flex-col items-center p-3 border rounded-lg cursor-pointer"
        :class="{
          'bg-blue-200 border-blue-500': selectedCategory === category.name,
          'bg-gray-50 hover:bg-gray-100 border-gray-300': selectedCategory !== category.name,
        }"
        @click="selectCategory(category.name)"
      >
        <font-awesome-icon :icon="category.icon" class="text-3xl mb-1" />
        <span class="text-sm text-center font-medium">{{ category.name }}</span>
      </div>
    </div>
  </div>
</template>
