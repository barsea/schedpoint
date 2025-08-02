<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePlanStore } from '@/stores/plan'

const authStore = useAuthStore()
const planStore = usePlanStore()
const router = useRouter()

// --- ユーザーメニューのドロップダウン関連 ---
const isUserDropdownOpen = ref(false)
const userDropdown = ref(null)

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
  // もう片方のドロップダウンが開いていたら閉じる
  isCreateDropdownOpen.value = false
}

// --- 「+作成」ボタンのドロップダウン関連 ---
const isCreateDropdownOpen = ref(false)
const createDropdown = ref(null) // テンプレート内の要素を参照するためのref
const toggleCreateDropdown = () => {
  isCreateDropdownOpen.value = !isCreateDropdownOpen.value
  // もう片方のドロップダウンが開いていたら閉じる
  isUserDropdownOpen.value = false
}

// メニューの外側をクリックしたかを判定する関数
const closeDropdowns = (event) => {
  if (userDropdown.value && !userDropdown.value.contains(event.target)) {
    isUserDropdownOpen.value = false
  }
  if (createDropdown.value && !createDropdown.value.contains(event.target)) {
    isCreateDropdownOpen.value = false
  }
}

// コンポーネントがマウントされた時にイベントリスナーを追加
onMounted(() => {
  window.addEventListener('click', closeDropdowns)
})

// コンポーネントがアンマウントされる時にイベントリスナーを削除
onUnmounted(() => {
  window.removeEventListener('click', closeDropdowns)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="container mx-auto flex items-center justify-between h-full px-4 py-3">
    <div class="flex items-center">
      <div class="text-2xl mr-8 text-gray-800">{{ planStore.formattedCurrentDate }}</div>
      <button
        @click="planStore.resetToToday()"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xl py-2 px-4 rounded-lg mr-6"
      >
        今日
      </button>
      <button
        @click="planStore.changeDate(-1)"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg mr-4"
      >
        前日
      </button>
      <button
        @click="planStore.changeDate(1)"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
      >
        翌日
      </button>
    </div>

    <div class="flex items-center space-x-4">
      <!-- 未ログイン時の表示 -->
      <div v-if="!authStore.isLoggedIn" class="space-x-4">
        <router-link
          to="/login"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          ログイン
        </router-link>
        <router-link
          to="/signup"
          class="bg-blue-500 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white rounded-md"
        >
          新規登録
        </router-link>
      </div>
      <!-- ログイン時の表示 -->
      <div v-else class="flex items-center space-x-4">
        <!-- ユーザー名とプルダウンメニュー -->
        <div class="relative" ref="userDropdown">
          <!-- @clickでプルダウンの表示/非表示を切り替え -->
          <button
            @click.prevent="toggleUserDropdown"
            class="flex items-center space-x-2 focus:outline-none"
          >
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{
              authStore.userName
            }}</span>
            <svg
              class="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <!-- v-ifでプルダウンメニューの表示を制御 -->
          <div
            v-if="isUserDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10"
          >
            <a
              href="#"
              @click.prevent="handleLogout"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              ログアウト
            </a>
          </div>
        </div>

        <!-- 「+ 作成」ボタンをドロップダウンに変更 -->
        <div class="relative" ref="createDropdown">
          <!-- ボタン: クリックで isCreateDropdownOpen の状態を切り替える -->
          <button
            @click.prevent="toggleCreateDropdown"
            class="flex items-center bg-blue-500 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white rounded-md"
          >
            <span>+ 作成</span>
            <svg
              class="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <!-- ドロップダウンメニュー: isCreateDropdownOpen が true の時だけ表示 -->
          <div
            v-if="isCreateDropdownOpen"
            class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10"
          >
            <!-- 予定作成ページへのリンク -->
            <RouterLink
              to="/events/new/plan"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="isCreateDropdownOpen = false"
            >
              予定
            </RouterLink>
            <!-- 実績作成ページへのリンク -->
            <RouterLink
              to="/events/new/actual"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="isCreateDropdownOpen = false"
            >
              実績
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
