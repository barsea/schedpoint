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
        this.plans = response.data
      } catch (error) {
        console.error('予定の取得に失敗しました:', error)
        this.plans = []
      }
    },
  },
})
