<script setup>
  import Header from '../components/Header.vue'
  import TimeAxis from '../components/TimeAxis.vue'
  import ScheduleColumn from '../components/ScheduleColumn.vue'
  import EventBlock from '../components/EventBlock.vue'
</script>

<template>
  <div>
    <div class="w-full h-16 bg-sky-500 flex items-center justify-center text-white">
      <Header />
      <p>← Headerコンポーネントの範囲 →</p>
    </div>
    <div>
      <TimeAxis />
      <ScheduleColumn />
      <ScheduleColumn />
    </div>
  </div>
</template>
