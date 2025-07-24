import { defineStore } from 'pinia'
import axios from 'axios'

// 'YYYY-MM-DD'形式の、今日の日付文字列を返すヘルパー関数
const getTodayString = () => new Date().toISOString().split('T')[0]

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
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/plans?date=${date}`)

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
  },
})
