<script setup>
import { ref } from 'vue'
import CategorySelector from '@/components/CategorySelector.vue'

// フォームの各入力フィールドに対応するリアクティブなデータ
const category = ref('') // CategorySelectorからの選択を受け取る

// CategorySelectorから選択されたカテゴリを受け取るハンドラ
const handleCategoryUpdate = (selectedCat) => {
  category.value = selectedCat
  console.log('選択されたカテゴリ:', category.value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 class="text-2xl font-bold text-center mb-6">イベント作成</h1>
      <!-- v-model:selectedCategory を使用して、CategorySelectorからの選択をcategory変数にバインド -->
      <CategorySelector
        v-model:selectedCategory="category"
        @update:selectedCategory="handleCategoryUpdate"
      />
    </div>
  </div>
</template>

<style scoped></style>
