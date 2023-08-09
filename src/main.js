// import './assets/main.css'
// Vue3
import {createApp} from 'vue'
import App from './App.vue'
// ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// el-国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// el-theme
import 'element-plus/theme-chalk/dark/css-vars.css'
// el-cion
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 路由
import router from '../router.js'; // 引入 router.js 文件
// Vuex全局状态管理
import store from '../store'; // 假设你的 Vuex 配置在 store.js 文件中


const app = createApp(App)

// el-cion
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router); // 将 router 与应用关联
app.use(store); // 将 Vuex 的 store 与应用关联
app.use(ElementPlus, {
    locale: zhCn,
}) // 国际化

app.mount('#app')
