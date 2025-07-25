<script setup>
import { ref, watch } from 'vue'

// 親からカテゴリ一覧を受け取るための「props」を定義
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  // 親コンポーネントと選択されたカテゴリを双方向で連携させるための設定 (v-model用)
  modelValue: {
    type: Object, // 文字列ではなく、カテゴリのオブジェクト全体を受け取る
    default: null,
  },
})

// 親コンポーネントに選択内容の変更を伝えるための「emit」を定義
const emit = defineEmits(['update:modelValue'])

// 選択されているカテゴリのオブジェクトを保持する
const selectedCategory = ref(props.modelValue)

// 親のデータ(modelValue)が変わったときに、子のデータ(selectedCategory)も更新する
watch(
  () => props.modelValue,
  (newValue) => {
    selectedCategory.value = newValue
  },
)
// カテゴリがクリックされたときの処理
const selectCategory = (category) => {
  // すでに選択されているカテゴリをもう一度クリックしたら、選択を解除する
  if (selectedCategory.value && selectedCategory.value.id === category.id) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = category
  }
  // 親コンポーネントに、選択されたカテゴリの「オブジェクト」を伝える
  emit('update:modelValue', selectedCategory.value)
}
</script>

<template>
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">カテゴリ</label>
    <div class="grid grid-cols-6 gap-8">
      <div
        v-for="category in props.categories"
        :key="category.id"
        class="flex flex-col items-center p-3 border rounded-lg cursor-pointer"
        :class="{
          'bg-blue-200 border-blue-500': selectedCategory && selectedCategory.id === category.id,
          'bg-gray-50 hover:bg-gray-100 border-gray-300':
            !selectedCategory || selectedCategory.id !== category.id,
        }"
        @click="selectCategory(category)"
      >
        <font-awesome-icon
          v-if="category.icon"
          :icon="category.icon.split(' ')"
          class="text-3xl mb-1"
        />
        <span class="text-sm text-center font-medium">{{ category.name }}</span>
      </div>
    </div>
  </div>
</template>
