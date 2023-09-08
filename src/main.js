// import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
// Pinia
import {createPinia} from 'pinia';

// 创建 Vue 实例
const app = createApp(App)
// 挂载到 Vue 根实例
app.use(createPinia())
app.mount('#app')
