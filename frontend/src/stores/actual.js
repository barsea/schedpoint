import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useActualStore = defineStore('actual', {
  state: () => ({
    actuals: [],
    isModalOpen: false,
    selectedActual: null,
  }),

  actions: {
    /**
     * 実績詳細モーダルを開くアクション
     * @param {object} actual - 表示する実績オブジェクト
     */
    openActualModal(actual) {
      this.selectedActual = actual
      this.isModalOpen = true
    },

    /**
     * 実績詳細モーダルを閉じるアクション
     */
    closeActualModal() {
      this.isModalOpen = false
      this.selectedActual = null
    },
    async fetchActuals(date) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('認証トークンがありません。')
        this.actuals = [] // トークンがなければ実績を空にする
        return
      }

      try {
        const headers = {
          // authStoreからトークンを取得するように変更
          Authorization: authStore.token,
        }
        const response = await axios.get(`http://localhost:3000/api/v1/actuals?date=${date}`, {
          headers,
        })

        const actualData = response.data.data
        const includedData = response.data.included || []

        const categoryMap = new Map(
          includedData
            .filter((item) => item.type === 'category')
            .map((item) => [item.id, item.attributes]),
        )

        const formattedActuals = actualData.map((actual) => {
          const categoryId = actual.relationships.category.data.id
          const category = categoryMap.get(categoryId)
          return {
            id: actual.id,
            ...actual.attributes,
            startTime: new Date(actual.attributes.start_time),
            endTime: new Date(actual.attributes.end_time),
            category: {
              id: categoryId,
              name: category ? category.name : '不明なカテゴリ',
            },
          }
        })
        this.actuals = formattedActuals
      } catch (error) {
        console.error('実績の取得に失敗しました', error)
        this.actuals = []
      }
    },

    async createActual(newActual) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('認証トークンがありません。')
        // レベルアップポイント3: コンポーネントに優しい返り値
        return { success: false, errors: ['ログインしてください。'] }
      }

      try {
        const headers = {
          // authStoreからトークンを取得するように変更
          Authorization: authStore.token,
        }

        const response = await axios.post(
          'http://localhost:3000/api/v1/actuals',
          { actual: newActual },
          { headers },
        )

        const newActualData = response.data.data
        const newCategoryId = newActualData.relationships.category.data.id
        const category = authStore.categories.find((c) => String(c.id) === String(newCategoryId))

        const formattedNewActual = {
          id: newActualData.id,
          ...newActualData.attributes,
          startTime: new Date(newActualData.attributes.start_time),
          endTime: new Date(newActualData.attributes.end_time),
          category: {
            id: newCategoryId,
            name: category ? category.name : '不明なカテゴリ',
          },
        }

        this.actuals.push(formattedNewActual)
        return { success: true }
      } catch (error) {
        console.error('実績の作成に失敗しました:', error.response?.data?.errors)
        return { success: false, errors: error.response?.data?.errors || ['作成に失敗しました'] }
      }
    },
  },
})
