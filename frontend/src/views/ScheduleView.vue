<script setup>
import { onMounted } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import TimeAxis from '../components/TimeAxis.vue'
import ScheduleColumn from '../components/ScheduleColumn.vue'
import { usePlanStore } from '@/stores/plan'
import { useActualStore } from '@/stores/actual'
import PlanDetailModal from '../components/PlanDetailModal.vue'

const planStore = usePlanStore()
const actualStore = useActualStore()

onMounted(() => {
  const today = new Date().toISOString().split('T')[0]
  Promise.all([planStore.fetchPlans(today), actualStore.fetchActuals(today)])
})

// イベントを処理してモーダルを開く関数を定義
const handlePlanClick = (plan) => {
  planStore.openPlanModal(plan)
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
        <ScheduleColumn title="実績" :events="actualStore.actuals" />
      </div>
    </div>
  </div>

  <!-- 
    v-ifでモーダルを表示/非表示
    :planで選択された予定データをPropsとして渡す
  -->
  <PlanDetailModal
    v-if="planStore.isModalOpen && planStore.selectedPlan"
    :plan="planStore.selectedPlan"
  />
</template>
