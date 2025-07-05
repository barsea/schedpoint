<script setup>
import TheHeader from '../components/TheHeader.vue'
import TimeAxis from '../components/TimeAxis.vue'
import ScheduleColumn from '../components/ScheduleColumn.vue'

// --- 予定のモックデータ ---
const plannedEvents = [
  {
    id: 1,
    category: '開発',
    startTime: new Date('2025-06-26T09:00:00'),
    endTime: new Date('2025-06-26T10:30:00'),
  },
  {
    id: 2,
    category: '休憩',
    startTime: new Date('2025-06-26T12:00:00'),
    endTime: new Date('2025-06-26T12:30:00'),
  },
  {
    id: 3,
    category: '学習',
    startTime: new Date('2025-06-26T14:00:00'),
    endTime: new Date('2025-06-26T16:00:00'),
  },
  {
    id: 4,
    category: 'ミーティング',
    startTime: new Date('2025-06-26T08:00:00'),
    endTime: new Date('2025-06-26T08:45:00'),
  },
  {
    id: 5,
    category: '短い予定',
    startTime: new Date('2025-06-26T17:00:00'),
    endTime: new Date('2025-06-26T17:15:00'),
  },
]

// --- 実績のモックデータ ---
const actualEvents = [
  {
    id: 101,
    category: '開発 (実績)',
    startTime: new Date('2025-06-26T09:15:00'), // 予定より少し遅れて開始
    endTime: new Date('2025-06-26T10:45:00'),
  },
  {
    id: 102,
    category: '休憩 (実績)',
    startTime: new Date('2025-06-26T12:00:00'),
    endTime: new Date('2025-06-26T12:45:00'), // 予定より長めに休憩
  },
  {
    id: 103,
    category: '学習 (実績)',
    startTime: new Date('2025-06-26T14:30:00'), // 予定より遅れて開始
    endTime: new Date('2025-06-26T16:00:00'),
  },
  {
    id: 104,
    category: 'ミーティング (実績)',
    startTime: new Date('2025-06-26T08:00:00'),
    endTime: new Date('2025-06-26T08:30:00'), // 予定より早く終了
  },
  {
    id: 105,
    category: '短い予定 (実績)',
    startTime: new Date('2025-06-26T17:00:00'),
    endTime: new Date('2025-06-26T17:05:00'), // さらに短い実績
  },
]
</script>

<template>
  <div class="flex flex-col items-center h-screen bg-[#f3f7ff]">
    <div
      class="w-full max-w-[1500px] h-[100px] bg-light-gray-blue border-2 border-slate-300 flex-shrink-0"
    >
      <TheHeader />
    </div>

    <div
      class="relative flex flex-grow w-full max-w-[1500px] border-x-2 border-b-2 border-slate-300 overflow-y-auto"
    >
      <div class="w-[100px] min-h-[1216px] flex-grow bg-white">
        <TimeAxis />
      </div>
      <div class="w-[700px] min-h-[1216px] flex-grow bg-white border-x-2 border-slate-300">
        <ScheduleColumn title="予定" :events="plannedEvents" />
      </div>
      <div class="w-[700px] min-h-[1216px] flex-grow bg-white">
        <ScheduleColumn title="実績" :events="actualEvents" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
