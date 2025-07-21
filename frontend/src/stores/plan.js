import { defineStore } from 'pinia'
import axios from 'axios'

export const usePlanStore = defineStore('plan', {
  state: () => ({
    plans: [],
  }),

  getters: {},

  actions: {
    /**
     * @param {string} date
     */
    async fetchPlans(date) {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/plans?date=${date}`)

        const formattedPlans = response.data.map((plan) => {
          return {
            ...plan,
            startTime: new Date(plan.start_time),
            endTime: new Date(plan.end_time),
          }
        })

        this.plans = formattedPlans
      } catch (error) {
        console.error('予定の取得に失敗しました:', error)
        this.plans = []
      }
    },
  },
})
