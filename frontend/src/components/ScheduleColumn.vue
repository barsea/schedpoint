<script setup>
import { computed } from 'vue'
import EventBlock from './EventBlock.vue'
import { usePlanStore } from '@/stores/plan'

const emit = defineEmits(['plan-click', 'actual-click'])

// 親からeventsデータを受け取るようにPropsを定義
const props = defineProps({
  title: String,
  events: {
    type: Array,
    default: () => [],
  },
})

const planStore = usePlanStore()
// 各時間枠divの高さ (h-12 = 48px)
const SLOT_HEIGHT = 48
// h2タグの高さ (h-16 = 64px)
const HEADER_HEIGHT = 64

// props.eventsを直接使わず、日付またぎを考慮して加工したリストを生成する
const processedEvents = computed(() => {
  if (!planStore.currentDate) return []

  // JSTでの今日の日付の開始時刻 (例: 2025-08-09 00:00:00 JST)
  const dayStart = new Date(`${planStore.currentDate}T00:00:00`)
  // JSTでの今日の日付の終了時刻 (例: 2025-08-09 23:59:59 JST)
  const dayEnd = new Date(`${planStore.currentDate}T23:59:59.999`)

  return props.events.map((event) => {
    // バックエンド(UTC)から渡された日時文字列は、`new Date()`によってブラウザのローカルタイム(JST)に変換される。
    // そのため、ここからの日時の比較や加工はすべてJST基準で行われる。

    // イベントの開始時刻を、今日より前なら今日の開始時刻に、そうでなければ元の時刻に切り詰める(clamp)
    const clampedStartTime = new Date(Math.max(dayStart.getTime(), event.startTime.getTime()))
    // イベントの終了時刻を、今日より後なら今日の終了時刻に、そうでなければ元の時刻に切り詰める(clamp)
    const clampedEndTime = new Date(Math.min(dayEnd.getTime(), event.endTime.getTime()))

    // 元のイベント情報を引き継ぎつつ、表示用の開始・終了時刻を上書きした新しいオブジェクトを返す
    return {
      ...event,
      startTime: clampedStartTime,
      endTime: clampedEndTime,
    }
  })
})

const formatTime = (date) => {
  if (!date || !(date instanceof Date)) return ''
  // getHours()とgetMinutes()はブラウザのローカルタイム（日本時間）を返すので、ここでタイムゾーンが正しく扱われる
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
  // clampedEndTimeが23:59:59.999の場合があるので、getTime()の差分で正確に計算する
  let durationMinutes = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60)
  // 差分が0に近くなる場合も考慮し、最低でも1分は確保する
  durationMinutes = Math.max(durationMinutes, 1)

  const topPosition = HEADER_HEIGHT + (totalStartMinutes / 60) * SLOT_HEIGHT
  const eventHeight = (durationMinutes / 60) * SLOT_HEIGHT

  return {
    top: `${topPosition}px`,
    height: `${eventHeight}px`,
  }
}

/**
 * クリックイベントを処理し、親コンポーネントに通知する関数
 * props.titleに応じて、発行するイベントを切り替える。
 * @param {object} event - クリックされた予定オブジェクト
 */
const handleEventClick = (event) => {
  if (props.title === '予定') {
    // 'plan-click' という名前のイベントを発行し、クリックされた予定データを一緒に渡す。
    emit('plan-click', event)
  } else if (props.title === '実績') {
    emit('actual-click', event)
  }
}
</script>

<template>
  <div class="relative">
    <h2 class="flex items-center justify-center h-16 text-3xl border-b-2 border-slate-300">
      {{ title }}
    </h2>
    <div v-for="n in 24" :key="n" class="h-12 pr-2 border-b border-gray-200"></div>
    <!-- EventBlockがクリックされたらhandleEventClickを呼び出す -->
    <EventBlock
      v-for="event in processedEvents"
      :key="event.id"
      :category-name="event.category?.name || event.memo"
      :time="`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`"
      :style="getEventStyle(event)"
      @click="handleEventClick(event)"
      class="cursor-pointer"
    />
  </div>
</template>
