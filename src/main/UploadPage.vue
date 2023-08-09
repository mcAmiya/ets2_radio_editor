<template>
  <el-upload class="upload-demo" drag multiple list-type="text" :auto-upload="false" :on-change="openFile">
    <el-icon class="el-icon--upload">
      <upload-filled/>
    </el-icon>
    <div class="el-upload__text">
      <!-- Drop file here or <em>click to upload</em> -->
      拖拽文件 或者 <em>点击这里</em> 上传
    </div>
    <template #tip>
      <div class="el-upload__tip">
        <!-- jpg/png files with a size less than 500kb -->
        请选择本地的电台数据文件
      </div>
    </template>
  </el-upload>
</template>

<script setup>
// 使用全局配置
import {useStore} from 'vuex';

const store = useStore();

// 调用父组件(App.vue)的changePage(newPage)函数来切换页面
const emit = defineEmits(['changePage'])
const changePage = (newPage) => {
  emit('changePage', newPage)
}

// 打开文件函数
const openFile = (file) => {
  // 使用FileReader读取文件内容
  var reader = new FileReader();
  reader.onload = () => {
    try {
      // 使用 store.commit 来提交 mutation
      store.commit('setFileContent', reader.result);
      // 调用父组件的方法切换组件
      changePage('MainPage')
    } catch (error) {
      console.error('上传文件失败：', error);
    }
  };

  reader.readAsText(file.raw);
};
</script>
  