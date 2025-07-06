<script setup></script>

<template>
  <div class="flex items-center justify-between h-full px-4">
    <div class="flex items-center">
      <div class="text-2xl mr-8">2025年6月26日</div>
      <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl py-2 px-4 rounded-lg mr-6">
        今日
      </button>
      <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg mr-4">
        前日
      </button>
      <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg">翌日</button>
    </div>

    <div class="flex">
      <RouterLink
        :to="{ name: 'event-new' }"
        class="bg-white hover:bg-[#d3e3fd] text-black text-xl py-4 px-8 rounded-lg flex items-center"
      >
        <span class="mr-1">+ 作成</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
