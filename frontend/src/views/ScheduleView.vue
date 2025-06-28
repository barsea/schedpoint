<template>
  <div class="flex flex-col items-center h-screen bg-[#f3f7ff]">

    <div class="w-full max-w-[1500px] h-[100px] bg-light-gray-blue border-2 border-slate-300 flex-shrink-0">
      <Header />
    </div>

    <div class="flex flex-grow w-full max-w-[1500px] border-x-2 border-b-2 border-slate-300 overflow-y-auto">
      <div class="w-[100px] min-h-[1152px] flex-grow bg-white">
        <TimeAxis />
      </div>
      <div class="w-[700px] min-h-[1152px] flex-grow bg-white border-x-2 border-slate-300">
        <ScheduleColumn title="予定" />
      </div>
      <div class="w-[700px] min-h-[1152px] flex-grow bg-white">
        <ScheduleColumn title="実績" />
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
