<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanStore } from '@/stores/plan'
import { useActualStore } from '@/stores/actual'
import { useAuthStore } from '@/stores/auth'
import CategorySelector from '@/components/CategorySelector.vue'

// 親コンポーネント（今回はルーター）から渡されるデータを受け取るための設定
// これにより、このフォームが 'plan' と 'actual' のどちらのモードで動作すべきかを判断する
const props = defineProps({
  eventType: {
    type: String,
    required: true,
    validator: (value) => ['plan', 'actual'].includes(value),
  },
})

const router = useRouter()
const planStore = usePlanStore()
const actualStore = useActualStore()
const authStore = useAuthStore()

// フォームの各入力フィールドに対応するリアクティブなデータ
const selectedCategoryObject = ref(null) // CategorySelectorからの選択を受け取る
const startTime = ref('')
const endTime = ref('')
const memo = ref('')

// --- 動的なフォームタイトルの設定 ---
// props.eventType の値に応じて、ページのタイトルを動的に変更する
const formTitle = computed(() => {
  return props.eventType === 'plan' ? '予定の作成' : '実績の作成'
})

// コンポーネントが表示されたときにカテゴリを取得する
onMounted(() => {
  // もしストアにカテゴリがなければ取得する
  if (authStore.categories.length === 0) {
    authStore.fetchCategories()
  }
})

// フォーム送信時の処理
const handleSubmit = async () => {
  // バリデーション: カテゴリが選択されているか確認
  if (!selectedCategoryObject.value || !selectedCategoryObject.value.id) {
    alert('カテゴリを選択してください。') // 本来はアラートではなく、UIでエラー表示するのが望ましい
    return
  }

  // APIに送信するデータを作成
  const eventData = {
    category_id: selectedCategoryObject.value.id,
    start_time: startTime.value,
    end_time: endTime.value,
    memo: memo.value,
  }

  let result

  // props.eventType の値に応じて、呼び出すストアのアクションを切り替える
  if (props.eventType === 'plan') {
    result = await planStore.createPlan(eventData)
  } else {
    result = await actualStore.createActual(eventData)
  }

  // 作成が成功したらトップページに遷移
  if (result.success) {
    router.push('/')
  } else {
    const eventTypeName = props.eventType === 'plan' ? '予定' : '実績'
    alert(`${eventTypeName}の作成に失敗しました。\n` + (result.errors || []).join('\n'))
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 class="text-2xl font-bold text-center mb-6">{{ formTitle }}</h1>
      <form @submit.prevent="handleSubmit">
        <!-- カテゴリ選択コンポーネントを組み込み -->
        <!-- v-model:selectedCategory を使用して、CategorySelectorからの選択をcategory変数にバインド -->
        <CategorySelector :categories="authStore.categories" v-model="selectedCategoryObject" />

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
          <small class="text-gray-500">最大100文字</small>
        </div>

        <!-- ボタンのグループ -->
        <div class="flex items-center justify-between mt-6">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            保存
          </button>
          <button
            type="button"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            @click="$router.back()"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
