import {createRouter, createWebHistory} from 'vue-router';

import MainPage from './src/main/MainPage.vue'

const routes = [
    // { path: '/', name: 'Upload', component: test },
    {path: '/', name: 'MainPage', component: MainPage},
    // { path: '/demo', name: 'demo', component: demo },
    // 其他路由配置
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
