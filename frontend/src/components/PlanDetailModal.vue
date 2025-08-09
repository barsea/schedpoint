<script setup>
import { ref, watch } from 'vue'
import { usePlanStore } from '@/stores/plan'
import { useAuthStore } from '@/stores/auth'
import CategorySelector from '@/components/CategorySelector.vue'

// --- ヘルパー関数 ---
// Dateオブジェクトを <input type="datetime-local"> が解釈できる形式に変換する
const toLocalISOString = (date) => {
  if (!(date instanceof Date)) {
    return ''
  }
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// 親コンポーネントから'plan'という名前でデータを受け取る
const props = defineProps({
  plan: {
    type: Object,
    required: true, // 必須項目に設定
  },
})

// ストアをインスタンス化
const planStore = usePlanStore()
const authStore = useAuthStore()

const selectedCategoryObject = ref(null)
const startTime = ref('')
const endTime = ref('')
const memo = ref('')

// watchを使って、props.planが変更されるたびにフォームの値を更新する
watch(
  [() => props.plan, () => authStore.categories],
  ([newPlan, categories]) => {
    // planデータがあり、かつ、カテゴリ一覧が取得済みの時だけ処理を実行
    if (newPlan && categories.length > 0) {
      selectedCategoryObject.value = categories.find(
        (c) => String(c.id) === String(newPlan.category.id), // 両方を文字列に変換して比較するように修正
      )
      // 日時は 'YYYY-MM-DDTHH:mm' 形式の文字列に変換する
      startTime.value = toLocalISOString(newPlan.startTime)
      endTime.value = toLocalISOString(newPlan.endTime)
      memo.value = newPlan.memo
    }
  },
  { immediate: true }, // コンポーネントの初回表示時にも即時実行するオプション
)

// --- イベントハンドラ ---
/**
 * 更新ボタンがクリックされたときの処理
 */
const handleUpdate = async () => {
  if (!selectedCategoryObject.value) {
    alert('カテゴリを選択してください。')
    return
  }

  const planData = {
    id: props.plan.id, // 更新対象のIDを忘れずに含める
    category_id: selectedCategoryObject.value.id,
    start_time: startTime.value,
    end_time: endTime.value,
    memo: memo.value,
  }

  const result = await planStore.updatePlan(planData)
  if (!result.success) {
    alert('予定の更新に失敗しました。\n' + (result.errors || []).join('\n'))
  }
}

/**
 * 削除ボタンがクリックされたときの処理
 */
const handleDelete = async () => {
  // ユーザーに最終確認
  if (window.confirm('この予定を本当に削除しますか？')) {
    const result = await planStore.deletePlan(props.plan.id)
    if (!result.success) {
      alert('予定の削除に失敗しました。\n' + (result.errors || []).join('\n'))
    }
  }
}

// モーダルを閉じるための関数
const closeModal = () => {
  planStore.closePlanModal()
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
      <h2 class="text-2xl font-bold text-center mb-6">予定の詳細・編集</h2>
      <!-- formのsubmitイベントでhandleUpdateを呼び出す -->
      <form @submit.prevent="handleUpdate">
        <!-- v-modelでローカル変数とフォームをバインド -->
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

        <div class="flex items-center justify-between mt-6">
          <div>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            >
              更新
            </button>
            <!-- 削除ボタンのクリックイベントでhandleDeleteを呼び出す -->
            <button
              type="button"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline ml-4"
              @click="handleDelete"
            >
              削除
            </button>
          </div>
          <button
            type="button"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            @click="closeModal"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
