<script setup>
import EventBlock from './EventBlock.vue'

defineProps({
  title: String,
})

// --- イベントのモックデータ ---
const events = [
  {
    id: 1,
    category: '開発',
    startTime: new Date('2025-06-26T09:00:00'),
    endTime: new Date('2025-06-26T10:45:00'),
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
  // 最低幅のテスト用データ
  {
    id: 5,
    category: '短い予定',
    startTime: new Date('2025-06-26T17:00:00'),
    endTime: new Date('2025-06-26T17:15:00'), // 15分
  },
  {
    id: 6,
    category: '極短予定',
    startTime: new Date('2025-06-26T18:00:00'),
    endTime: new Date('2025-06-26T18:05:00'), // 5分
  },
  // 31分以上60分以内のテスト (35分)
  {
    id: 7,
    category: '中時間予定',
    startTime: new Date('2025-06-26T19:00:00'),
    endTime: new Date('2025-06-26T19:35:00'),
  },
]

// 各時間枠divの高さ (h-12 = 48px)
const SLOT_HEIGHT = 48
// h2タグの高さ (h-16 = 64px)
const HEADER_HEIGHT = 64

// イベントのスタイルを計算する関数
const getEventStyle = (event) => {
  // 開始時刻を基準にtopを計算
  const startHour = event.startTime.getHours()
  const startMinutes = event.startTime.getMinutes()
  const totalStartMinutes = startHour * 60 + startMinutes // 00:00からの総分数

  // 終了時刻と開始時刻の差分から高さを計算
  let durationMinutes = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60)

  // ここで最低30分を保証
  durationMinutes = Math.ceil(Math.max(durationMinutes, 1) / 30) * 30 // 最小値を30分に設定

  const topPosition = HEADER_HEIGHT + (totalStartMinutes / 60) * SLOT_HEIGHT
  const eventHeight = (durationMinutes / 60) * SLOT_HEIGHT

  return {
    top: `${topPosition}px`,
    height: `${eventHeight}px`,
  }
}
</script>

<template>
  <div class="relative">
    <h2 class="flex items-center justify-center h-16 text-3xl border-b-2 border-slate-300">
      {{ title }}
    </h2>
    <div v-for="n in 24" :key="n" class="h-12 pr-2 border-b border-gray-200"></div>
    <EventBlock
      v-for="event in events"
      :key="event.id"
      :category-name="event.category"
      :time="`${event.startTime.getHours().toString().padStart(2, '0')}:${event.startTime.getMinutes().toString().padStart(2, '0')} - ${event.endTime.getHours().toString().padStart(2, '0')}:${event.endTime.getMinutes().toString().padStart(2, '0')}`"
      :style="getEventStyle(event)"
    />
  </div>
</template>

<style scoped></style>
