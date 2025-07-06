import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// --- Font Awesome の設定をここから ---
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faBed, // 睡眠
  faUtensils, // 食事
  faMobileAlt, // スマホ
  faLaptop, // PC
  faGamepad, // ゲーム
  faBookOpen, // 勉強
  faBath, // お風呂
} from '@fortawesome/free-solid-svg-icons'

library.add(faBed, faUtensils, faMobileAlt, faLaptop, faGamepad, faBookOpen, faBath)
// --- Font Awesome の設定はここまで ---

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
