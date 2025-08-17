import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'
import { useActualStore } from './actual'

// 'YYYY-MM-DD'形式の、今日の日付文字列を返すヘルパー関数
const getTodayString = () => {
  const today = new Date() // PCのローカルタイム（日本時間）でDateオブジェクトを生成
  const year = today.getFullYear() // 年を取得
  const month = String(today.getMonth() + 1).padStart(2, '0') // 月を取得（0から始まるので+1する）
  const day = String(today.getDate()).padStart(2, '0') // 日を取得

  return `${year}-${month}-${day}` // 'YYYY-MM-DD'形式の文字列を組み立てて返す
}

export const usePlanStore = defineStore('plan', {
  state: () => ({
    plans: [],
    // currentDateを 'YYYY-MM-DD' 形式の文字列で管理します
    currentDate: getTodayString(),
    isModalOpen: false,
    selectedPlan: null,
  }),

  getters: {
    // currentDateを 'YYYY年M月D日' 形式の日本語文字列にフォーマットして返す。ヘッダーの日付表示で使う。
    formattedCurrentDate: (state) => {
      // 'YYYY-MM-DD' 文字列からDateオブジェクトを生成
      // 'T00:00:00Z' をつけないと、ローカルタイムゾーンで解釈される可能性があるためUTCを明示
      const date = new Date(`${state.currentDate}T00:00:00Z`)

      // 日本語ロケールとJSTタイムゾーンを指定してフォーマット
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Tokyo', // タイムゾーンをJSTに固定
      }
      return new Intl.DateTimeFormat('ja-JP', options).format(date)
    },
  },

  actions: {
    /**
     * 予定詳細モーダルを開くアクション
     * @param {object} plan - 表示する予定オブジェクト
     */
    openPlanModal(plan) {
      this.selectedPlan = plan
      this.isModalOpen = true
    },

    /**
     * 予定詳細モーダルを閉じるアクション
     */
    closePlanModal() {
      this.isModalOpen = false
      this.selectedPlan = null
    },

    /**
     * @param {string} date - 'YYYY-MM-DD'形式の日付文字列
     */
    async fetchPlans(date) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('認証トークンがありません。')
        this.plans = []
        return
      }

      try {
        const headers = {
          Authorization: authStore.token,
        }
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/plans?date=${date}`
        const response = await axios.get(apiUrl, { headers })

        // jsonapi-serializerからのレスポンスを分解
        const planData = response.data.data
        const includedData = response.data.included

        // カテゴリ情報をIDですぐに探せるように、Mapオブジェクトに変換しておく
        const categoryMap = new Map(
          includedData
            .filter((item) => item.type === 'category')
            .map((item) => [item.id, item.attributes]),
        )

        // APIからのデータを、コンポーネントが使いやすい形式に整形する
        const formattedPlans = planData.map((plan) => {
          const categoryId = plan.relationships.category.data.id
          const category = categoryMap.get(categoryId)
          return {
            id: plan.id,
            // plan.attributesから他のプロパティを取得
            ...plan.attributes,
            // 文字列の日付をDateオブジェクトに変換
            startTime: new Date(plan.attributes.start_time),
            endTime: new Date(plan.attributes.end_time),
            // 関連するカテゴリ情報も追加
            category: {
              id: categoryId,
              name: category.name,
            },
          }
        })

        this.plans = formattedPlans
      } catch (error) {
        console.error('予定の取得に失敗しました:', error)
        this.plans = []
      }
    },

    /**
     * 現在の日付を変更し、その日付の予定と実績を再取得するアクション
     * @param {number} days - 変更する日数（-1なら昨日、1なら明日）
     */
    async changeDate(days) {
      // 現在の日付をDateオブジェクトに変換
      const newDate = new Date(this.currentDate)
      // 日付を加算/減算
      newDate.setDate(newDate.getDate() + days)
      // 'YYYY-MM-DD'形式の文字列に戻してstateを更新
      this.currentDate = newDate.toISOString().split('T')[0]

      // actualStoreをインスタンス化
      const actualStore = useActualStore()
      // Promise.allを使って、予定の取得と実績の取得を「同時に」開始する
      // これにより、片方の通信が終わるのを待たずに済むため、表示が少し速くなる
      await Promise.all([
        this.fetchPlans(this.currentDate),
        actualStore.fetchActuals(this.currentDate),
      ])
    },

    /**
     * 日付を今日にリセットし、今日の予定と実績を再取得するアクション
     */
    async resetToToday() {
      this.currentDate = getTodayString()

      const actualStore = useActualStore()
      await Promise.all([
        this.fetchPlans(this.currentDate),
        actualStore.fetchActuals(this.currentDate),
      ])
    },

    /**
     * 新しい予定を作成するアクション
     * @param {object} planData - { memo, start_time, end_time, category_id }
     */
    async createPlan(planData) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('認証トークンがありません。')
        return { success: false, errors: ['ログインしてください。'] }
      }

      try {
        const headers = {
          Authorization: authStore.token,
        }

        // Rails APIが受け取る形式 { plan: { ... } } に合わせてデータを整形
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/plans`
        const response = await axios.post(apiUrl, { plan: planData }, { headers })

        const newPlanData = response.data.data
        const newCategoryId = newPlanData.relationships.category.data.id

        // ストアのカテゴリ一覧から、IDが一致するものを探す
        const category = authStore.categories.find((c) => c.id === newCategoryId)

        // APIから返ってきた作成済みのデータを、Vueが使いやすい形に再加工する
        const newPlan = {
          id: newPlanData.id,
          ...newPlanData.attributes,
          startTime: new Date(newPlanData.attributes.start_time),
          endTime: new Date(newPlanData.attributes.end_time),
          category: {
            id: newCategoryId,
            name: category ? category.name : '不明なカテゴリ',
          },
        }

        // stateのplans配列に新しい予定を追加する。これにより、ページをリロードしなくてもカレンダーに即時反映される
        this.plans.push(newPlan)
        return { success: true }
      } catch (error) {
        console.error('予定の作成に失敗しました:', error.response?.data?.errors)
        return { success: false, errors: error.response?.data?.errors }
      }
    },

    /**
     * 既存の予定を更新するアクション
     * @param {object} planData - { id, memo, start_time, end_time, category_id }
     */
    async updatePlan(planData) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('認証トークンがありません。')
        return { success: false, errors: ['ログインしてください。'] }
      }

      // 更新対象のIDを分割代入で取り出しておく
      const { id, ...updateData } = planData

      try {
        const headers = {
          Authorization: authStore.token,
        }

        // Rails APIが受け取る形式 { plan: { ... } } に合わせてデータを整形
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/plans/${id}`
        const response = await axios.put(apiUrl, { plan: updateData }, { headers })

        // --- ここからが画面への即時反映処理 ---
        const updatedPlanData = response.data.data
        const categoryId = updatedPlanData.relationships.category.data.id
        const category = authStore.categories.find((c) => String(c.id) === String(categoryId))

        // APIからのレスポンスを、stateで管理している形式に再加工
        const formattedUpdatedPlan = {
          id: updatedPlanData.id,
          ...updatedPlanData.attributes,
          startTime: new Date(updatedPlanData.attributes.start_time),
          endTime: new Date(updatedPlanData.attributes.end_time),
          category: {
            id: categoryId,
            name: category ? category.name : '不明なカテゴリ',
          },
        }

        // stateのplans配列から、更新したplanと同じIDのものを探し、そのインデックス番号を取得
        const index = this.plans.findIndex((p) => p.id === formattedUpdatedPlan.id)

        // もし見つかれば、その要素を新しいデータで置き換える
        if (index !== -1) {
          this.plans[index] = formattedUpdatedPlan
        }
        // --- ここまでが即時反映処理 ---

        this.closePlanModal() // 最後にモーダルを閉じる
        return { success: true }
      } catch (error) {
        console.error('予定の更新に失敗しました:', error.response?.data?.errors)
        return { success: false, errors: error.response?.data?.errors }
      }
    },

    /**
     * 予定を削除するアクション
     * @param {string} planId - 削除する予定のID
     */
    async deletePlan(planId) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('認証トークンがありません。')
        return { success: false, errors: ['ログインしてください。'] }
      }

      try {
        const headers = {
          Authorization: authStore.token,
        }

        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/plans/${planId}`
        // DELETEリクエストを送信
        await axios.delete(apiUrl, { headers })

        // --- 画面への即時反映処理 ---
        // state.plans配列から、削除したIDと一致しないものだけをフィルタリングして新しい配列を作る
        this.plans = this.plans.filter((p) => p.id !== planId)

        this.closePlanModal() // 最後にモーダルを閉じる
        return { success: true }
      } catch (error) {
        console.error('予定の削除に失敗しました:', error.response?.data?.errors)
        return { success: false, errors: error.response?.data?.errors }
      }
    },
  },
})
