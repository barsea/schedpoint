<script setup>
import EventBlock from './EventBlock.vue'

const emit = defineEmits(['plan-click'])

// 親からeventsデータを受け取るようにPropsを定義
defineProps({
  title: String,
  events: {
    type: Array,
    default: () => [], // デフォルト値として空の配列を設定
  },
})

// 各時間枠divの高さ (h-12 = 48px)
const SLOT_HEIGHT = 48
// h2タグの高さ (h-16 = 64px)
const HEADER_HEIGHT = 64

const formatTime = (date) => {
  if (!date || !(date instanceof Date)) return ''
  // getHours()とgetMinutes()はブラウザのローカルタイム（日本時間）を返すので、ここでタイムゾーンが正しく扱われます
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// イベントのスタイルを計算する関数
const getEventStyle = (event) => {
  // 開始時刻を基準にtopを計算
  const startHour = event.startTime.getHours()
  const startMinutes = event.startTime.getMinutes()
  const totalStartMinutes = startHour * 60 + startMinutes // 00:00からの総分数

  // 終了時刻と開始時刻の差分から高さを計算
  let durationMinutes = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60)

  // 最低30分の高さ
  durationMinutes = Math.max(durationMinutes, 30)

  const topPosition = HEADER_HEIGHT + (totalStartMinutes / 60) * SLOT_HEIGHT
  const eventHeight = (durationMinutes / 60) * SLOT_HEIGHT

  return {
    top: `${topPosition}px`,
    height: `${eventHeight}px`,
  }
}

/**
 * クリックイベントを処理し、親コンポーネントに通知する関数
 * @param {object} event - クリックされた予定オブジェクト
 */
const handlePlanClick = (event) => {
  // 'plan-click' という名前のイベントを発行し、クリックされた予定データを一緒に渡します。
  emit('plan-click', event)
}
</script>

<template>
  <div class="relative">
    <h2 class="flex items-center justify-center h-16 text-3xl border-b-2 border-slate-300">
      {{ title }}
    </h2>
    <div v-for="n in 24" :key="n" class="h-12 pr-2 border-b border-gray-200"></div>
    <!-- EventBlockがクリックされたらhandlePlanClickを呼び出す -->
    <EventBlock
      v-for="event in events"
      :key="event.id"
      :category-name="event.category?.name || event.memo"
      :time="`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`"
      :style="getEventStyle(event)"
      @click="handlePlanClick(event)"
      class="cursor-pointer"
    />
  </div>
</template>
