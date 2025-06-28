<template>
  <div class="flex flex-col items-center h-screen">
    <div class="w-full max-w-[1500px] h-[100px] bg-light-gray-blue border-2 border-[#e1e7ee]">
      <Header />
    </div>
    <div class="flex flex-grow w-full max-w-[1500px] overflow-y-auto">
      <div class="w-[100px] bg-white border-x-2 border-[#e1e7ee]">
        <TimeAxis />
      </div>
      <div class="w-[700px] bg-sky-500">
        <ScheduleColumn />
      </div>
      <div class="w-[700px] bg-sky-400">
        <ScheduleColumn />
      </div>
    </div>
  </div>
</template>

<script setup>
  import Header from '../components/Header.vue'
  import TimeAxis from '../components/TimeAxis.vue'
  import ScheduleColumn from '../components/ScheduleColumn.vue'
  import EventBlock from '../components/EventBlock.vue'
</script>

<style scoped>
</style>
