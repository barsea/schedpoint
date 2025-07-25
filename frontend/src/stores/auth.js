import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    categories: [],
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.user?.attributes?.name,
  },

  actions: {
    initialize() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        // 1. ストアの記憶を復元する
        this.token = token
        this.user = JSON.parse(user)

        // 2. これからのAPI通信のために、axiosにトークンをセットする
        axios.defaults.headers.common['Authorization'] = token

        // 3. 必要な関連データを取得する
        this.fetchCategories()
      }
    },

    async signup(name, email, password) {
      try {
        await axios.post('http://localhost:3000/users', {
          user: {
            name: name,
            email: email,
            password: password,
          },
        })
        return true
      } catch (error) {
        console.error('Signup failed:', error)
        return error.response?.data?.status?.message || '新規登録に失敗しました。'
      }
    },

    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:3000/users/sign_in', {
          user: { email, password },
        })

        const token = response.headers.authorization
        const user = response.data.data

        this.token = token
        this.user = user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        axios.defaults.headers.common['Authorization'] = token

        await this.fetchCategories()

        return true
      } catch (error) {
        console.error('Login failed:', error)
        this.logout()
        return false
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.categories = []
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },

    async fetchCategories() {
      if (!this.token) {
        console.error('カテゴリ取得には認証が必要です。')
        return
      }
      try {
        const headers = { Authorization: this.token }
        const response = await axios.get('http://localhost:3000/api/v1/categories', { headers })

        // jsonapi-serializer形式のデータを整形してstateに保存
        this.categories = response.data.data.map((item) => ({
          id: item.id,
          ...item.attributes,
        }))
      } catch (error) {
        console.error('カテゴリの取得に失敗しました:', error)
        this.categories = [] // エラー時は空にする
      }
    },
  },
})
