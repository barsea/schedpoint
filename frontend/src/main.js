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
  faBath, // お風呂
  faTrain, // 移動
  faBriefcase, // 仕事
  faSchool, // 学校
  faBookOpen, // 勉強
  faMobileAlt, // スマホ
  faLaptop, // PC
  faMusic, // 遊ぶ
  faGamepad, // ゲーム
  faTv, // TV
  faFilm, // 映画
  faBook, // 読書
  faFutbol, // スポーツ
  faShoppingCart, // 買い物
  faMugSaucer, // カフェ
  faBeerMugEmpty, // 飲み会
} from '@fortawesome/free-solid-svg-icons'

// library.add() にもこれらのアイコンを追加してください。
// 例: library.add(faBed, faUtensils, ..., faTrain, faSchool, ...);

library.add(
  faBed,
  faUtensils,
  faBath,
  faTrain,
  faBriefcase,
  faSchool,
  faBookOpen,
  faMobileAlt,
  faLaptop,
  faMusic,
  faGamepad,
  faTv,
  faFilm,
  faBook,
  faFutbol,
  faShoppingCart,
  faMugSaucer,
  faBeerMugEmpty,
)
// --- Font Awesome の設定はここまで ---

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
