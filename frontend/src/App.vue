<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

// アプリ起動時に一度だけ、ログイン状態を復元する処理を呼び出す
const authStore = useAuthStore()
onMounted(() => {
  authStore.initialize()
})
</script>

<template>
  <main>
    <router-view />
  </main>
</template>

<style scoped></style>
