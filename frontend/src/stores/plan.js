import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

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
     * @param {string} date - 'YYYY-MM-DD'形式の日付文字列
     */
    async fetchPlans(date) {
      const authStore = useAuthStore() // 👈 2. 認証ストアをインスタンス化
      if (!authStore.token) {
        console.error('認証トークンがありません。')
        this.plans = []
        return
      }

      try {
        const headers = {
          Authorization: authStore.token,
        }
        const response = await axios.get(`http://localhost:3000/api/v1/plans?date=${date}`, {
          headers,
        })

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
     * 現在の日付を変更し、その日付の予定を再取得するアクション
     * @param {number} days - 変更する日数（-1なら昨日、1なら明日）
     */
    async changeDate(days) {
      // 現在の日付をDateオブジェクトに変換
      const newDate = new Date(this.currentDate)
      // 日付を加算/減算
      newDate.setDate(newDate.getDate() + days)
      // 'YYYY-MM-DD'形式の文字列に戻してstateを更新
      this.currentDate = newDate.toISOString().split('T')[0]

      // 新しい日付で予定データを再取得
      await this.fetchPlans(this.currentDate)
    },

    /**
     * 日付を今日にリセットし、今日の予定を再取得するアクション
     */
    async resetToToday() {
      this.currentDate = getTodayString()
      await this.fetchPlans(this.currentDate)
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
        const response = await axios.post(
          'http://localhost:3000/api/v1/plans',
          { plan: planData },
          { headers },
        )

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
  },
})
