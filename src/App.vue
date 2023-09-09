<script setup>
// ElementPlus组件国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const locale = ref(zhCn)

// 导入各个页面
import MainPage from '@/components/MainPage.vue'
import UploadPage from "@/components/UploadPage.vue";

// 默认页面
const page = ref('MainPage')
// 页面数
const pages = {
  UploadPage,
  MainPage
}

// 切换页面
const changePage = (newPage) => {
  console.log(`[changePage]切换页面至：${newPage}`)
  page.value = newPage.toString()
}
</script>

<!-- 页面 -->
<template>
  <!--  ElementPlus组件国际化-->
  <el-config-provider :locale="locale">
    <!--    <el-table mb-1 :data="[]"/>-->
    <component :is="pages[page]" @changePage="changePage"/>
    <!--    <el-table mb-1 :data="[]"/>-->
  </el-config-provider>
</template>


<style>
/* 字体 */
@font-face {
  font-family: 'HarmonyOS_Sans_SC_Medium';
  src: url("./font-style/HarmonyOS_Sans_SC_Medium.ttf");
}

@font-face {
  font-family: 'HarmonyOS_Sans_Medium';
  src: url("./font-style/HarmonyOS_Sans_Medium.ttf");
}

/* 全局字体 */
#app {
  font-family: HarmonyOS_Sans_SC_Medium, HarmonyOS_Sans_Medium, serif !important;
}

/* 继承上级(#app)的属性 */
.el-button {
  font-family: inherit;
}

</style>
