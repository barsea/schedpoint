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
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/actuals?date=${date}`
        const response = await axios.get(apiUrl, { headers })
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
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/actuals`
        const response = await axios.post(apiUrl, { actual: newActual }, { headers })
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

    /**
     * 既存の実績を更新するアクション
     * @param {object} actualData - { id, memo, start_time, end_time, category_id }
     */
    async updateActual(actualData) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('認証トークンがありません。')
        return { success: false, errors: ['ログインしてください。'] }
      }
      // 更新対象のIDを分割代入で取り出しておく
      const { id, ...updateData } = actualData

      try {
        const headers = {
          Authorization: authStore.token,
        }
        // Rails APIが受け取る形式 { actual: { ... } } に合わせてデータを整形
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/actuals/${id}`
        const response = await axios.put(apiUrl, { actual: updateData }, { headers })

        // --- ここからが画面への即時反映処理 ---
        const updatedActualData = response.data.data
        const categoryId = updatedActualData.relationships.category.data.id
        const category = authStore.categories.find((c) => String(c.id) === String(categoryId))
        // APIからのレスポンスを、stateで管理している形式に再加工
        const formattedUpdatedActual = {
          id: updatedActualData.id,
          ...updatedActualData.attributes,
          startTime: new Date(updatedActualData.attributes.start_time),
          endTime: new Date(updatedActualData.attributes.end_time),
          category: {
            id: categoryId,
            name: category ? category.name : '不明なカテゴリ',
          },
        }
        // stateのactuals配列から、更新したactualと同じIDのものを探し、そのインデックス番号を取得
        const index = this.actuals.findIndex((a) => a.id === formattedUpdatedActual.id)
        // もし見つかれば、その要素を新しいデータで置き換える
        if (index !== -1) {
          this.actuals[index] = formattedUpdatedActual
        }
        // --- ここまでが即時反映処理 ---

        this.closeActualModal() // 最後にモーダルを閉じる
        return { success: true }
      } catch (error) {
        console.error('実績の更新に失敗しました:', error.response?.data?.errors)
        return { success: false, errors: error.response?.data?.errors }
      }
    },

    /**
     * 実績を削除するアクション
     * @param {string} actualId - 削除する実績のID
     */
    async deleteActual(actualId) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('認証トークンがありません。')
        return { success: false, errors: ['ログインしてください。'] }
      }

      try {
        const headers = {
          Authorization: authStore.token,
        }
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/actuals/${actualId}`
        // DELETEリクエストを送信
        await axios.delete(apiUrl, { headers })
        // --- 画面への即時反映処理 ---
        // state.actuals配列から、削除したIDと一致しないものだけをフィルタリングして新しい配列を作る
        this.actuals = this.actuals.filter((a) => a.id !== actualId)
        this.closeActualModal() // 最後にモーダルを閉じる
        return { success: true }
      } catch (error) {
        console.error('実績の削除に失敗しました:', error.response?.data?.errors)
        return { success: false, errors: error.response?.data?.errors }
      }
    },
  },
})
