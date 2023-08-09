<script setup>
import {ref} from 'vue'

import UploadPage from './main/UploadPage.vue';
import MainPage from './main/MainPage.vue';


// 默认页面
const page = ref('UploadPage')
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
  <component :is="pages[page]" @changePage="changePage"/>
  <!-- <el-button @click="page = 'demo';console.log(1)">
    hi
  </el-button> -->
</template>


<style scoped></style>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>

