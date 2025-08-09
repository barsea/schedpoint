<script setup>
import { watch } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import TimeAxis from '../components/TimeAxis.vue'
import ScheduleColumn from '../components/ScheduleColumn.vue'
import { usePlanStore } from '@/stores/plan'
import { useActualStore } from '@/stores/actual'
import { useAuthStore } from '@/stores/auth'
import PlanDetailModal from '../components/PlanDetailModal.vue'
import ActualDetailModal from '../components/ActualDetailModal.vue'

const planStore = usePlanStore()
const actualStore = useActualStore()
const authStore = useAuthStore()

watch(
  // 監視対象のデータ
  () => authStore.isLoggedIn,
  // 監視対象のデータが変化したときに実行される関数
  (isLoggedIn) => {
    // ログイン状態が true になった瞬間にデータを取得する
    if (isLoggedIn) {
      const dateToFetch = planStore.currentDate
      Promise.all([planStore.fetchPlans(dateToFetch), actualStore.fetchActuals(dateToFetch)])
    }
  },
  // { immediate: true } オプションにより、コンポーネントがマウントされた直後にも、watch内の処理が一度だけ実行される。
  // これにより、すでにログイン済みの状態でページをリロードした場合にも対応できます。
  { immediate: true },
)

/**
 * 「予定」ブロックがクリックされたときの処理
 * @param {object} plan - クリックされた予定オブジェクト
 */
const handlePlanClick = (plan) => {
  planStore.openPlanModal(plan)
}

/**
 * 「実績」ブロックがクリックされたときの処理
 * @param {object} actual - クリックされた実績オブジェクト
 */
const handleActualClick = (actual) => {
  actualStore.openActualModal(actual)
}
</script>

<template>
  <div class="flex flex-col items-center h-screen bg-gray-100">
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
        <!-- @plan-clickで子からのイベントを捕捉する -->
        <ScheduleColumn title="予定" :events="planStore.plans" @plan-click="handlePlanClick" />
      </div>
      <div class="w-[700px] min-h-[1216px] flex-grow bg-white">
        <ScheduleColumn
          title="実績"
          :events="actualStore.actuals"
          @actual-click="handleActualClick"
        />
      </div>
    </div>
  </div>

  <!-- 予定詳細モーダル -->
  <PlanDetailModal
    v-if="planStore.isModalOpen && planStore.selectedPlan"
    :plan="planStore.selectedPlan"
  />

  <!-- 実績詳細モーダル -->
  <ActualDetailModal
    v-if="actualStore.isModalOpen && actualStore.selectedActual"
    :actual="actualStore.selectedActual"
  />
</template>
