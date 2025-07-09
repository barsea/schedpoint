<script setup>
import { ref } from 'vue'
import CategorySelector from '@/components/CategorySelector.vue'

// フォームの各入力フィールドに対応するリアクティブなデータ
const category = ref('') // CategorySelectorからの選択を受け取る
const startTime = ref('') //
const endTime = ref('') //
const memo = ref('') //

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
      <!-- カテゴリ選択コンポーネントを組み込み -->
      <!-- v-model:selectedCategory を使用して、CategorySelectorからの選択をcategory変数にバインド -->
      <CategorySelector
        v-model:selected-category="category"
        @update:selected-category="handleCategoryUpdate"
      />

      <!-- 開始日時 -->
      <div class="mb-4">
        <label for="startTime" class="block text-gray-700 text-sm font-bold mb-2">開始日時</label>
        <input
          id="startTime"
          v-model="startTime"
          type="datetime-local"
          class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <!-- 終了日時 -->
      <div class="mb-4">
        <label for="endTime" class="block text-gray-700 text-sm font-bold mb-2">終了日時</label>
        <input
          id="endTime"
          v-model="endTime"
          type="datetime-local"
          class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <!-- メモ -->
      <div class="mb-4">
        <label for="memo" class="block text-gray-700 text-sm font-bold mb-2">メモ（任意）</label>
        <textarea
          id="memo"
          v-model="memo"
          rows="4"
          class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
          placeholder="イベントの詳細やメモを入力"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
