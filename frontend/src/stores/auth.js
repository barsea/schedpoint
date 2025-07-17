import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.user?.name,
  },

  actions: {
    initialize() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        axios.defaults.headers.common['Authorization'] = token
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
          user: {
            email: email,
            password: password,
          },
        })

        const token = response.headers.authorization
        const user = response.data.data

        this.token = token
        this.user = user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        axios.defaults.headers.common['Authorization'] = token

        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },
  },
})
