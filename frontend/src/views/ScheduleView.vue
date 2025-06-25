<script setup>
  import Header from '../components/Header.vue'
  import TimeAxis from '../components/TimeAxis.vue'
  import ScheduleColumn from '../components/ScheduleColumn.vue'
  import EventBlock from '../components/EventBlock.vue'
</script>

<template>
  <div class="flex flex-col items-center h-screen">
    <div class="w-full max-w-[1900px] h-[100px] bg-indigo-500">
      <Header />
    </div>
    <div class="flex flex-grow w-full max-w-[1900px]">
      <div class="w-[100px] bg-lime-400">
        <TimeAxis />
      </div>
      <div class="w-[900px] bg-sky-500">
        <ScheduleColumn />
      </div>
      <div class="w-[900px] bg-sky-400">
        <ScheduleColumn />
      </div>
    </div>
  </div>
</template>
