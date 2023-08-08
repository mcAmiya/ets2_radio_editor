<template>
  <!-- 导入按钮 -->
  <el-button @click="changePage('UploadPage')" type="primary">
    <el-icon class="fa fa-edit icon"></el-icon>
    <span class="table-header-operate-text">导入</span>
  </el-button>

  <!-- 保存按钮 -->
  <el-button @click="saveFile(solveContent)" type="primary">
    <el-icon class="fa fa-edit icon"></el-icon>
    <span class="table-header-operate-text">保存</span>
  </el-button>

  <!-- 批量删除按钮 -->
  <el-button @click="delItemAll()" type="primary" disabled>
    <el-icon>
      <Delete />
    </el-icon>
    <span class="table-header-operate-text">批量删除</span>
  </el-button>

  <el-table :data="solveContent.stations" border :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }" :row-class-name="tableRowClassName" highlight-current-row
    @selection-change="handleSelectionChange" max-height="520">

    <!-- 表格列定义 -->
    <!-- 多选框 -->
    <el-table-column type="selection" width="55" />
    <!-- 数据 -->
    <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label">
      <!-- 星星替换 -->
      <template v-if="item.prop === 'liked'" v-slot="{ row }">
        <a v-if="row.liked">⭐</a>
        <a v-else>⛤</a>
      </template>
    </el-table-column>
    <!-- 删除框 -->
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" disabled>编辑</el-button>
        <el-button link type="primary" size="small" @click.prevent="deleteItem(scope.$index)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
  
<script setup>
// 使用全局配置
import { useStore } from 'vuex';
// 使用解析scs电台文件核心库
import read from '../js/read'
// Vue
import { ref, markRaw } from 'vue'
// Vue弹窗和图标
import { ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

// 调用父组件(App.vue)的changePage(newPage)函数来切换页面
const emit = defineEmits(['changePage'])
const changePage = (newPage) => {
  emit('changePage', newPage)
}

// 表格预定义
// var stations = []

var columns = [
  // 表格列定义
  { prop: 'liked', label: '⭐' },
  { prop: 'name', label: '名称' },
  { prop: 'genre', label: '流派' },
  { prop: 'country', label: '语言' },
  { prop: 'bitrate', label: '比特率' },
  { prop: 'url', label: 'URL' },
]

function tableRowClassName({ row, rowIndex }) {
  if (rowIndex === 1) {
    return 'warning-row';
  } else if (rowIndex === 3) {
    return 'success-row';
  }
  return '';
}
// 选择了的数据
var multipleSelection = []
function handleSelectionChange(val) {
  // console.info(val);
  multipleSelection = val;
}


const store = useStore();
// 文件内容等于全局配置的内容
const fileContent = store.state.fileContent;

// 文件内容解析
var solveContent = read.parseRadioData(fileContent)

// 表格数据导入
try {
  if (solveContent && Array.isArray(solveContent.stations)) {
    console.log('当前文件数据：', solveContent)
  }
} catch (error) {
  console.error('解析文件内容失败：', error);
}

// 保存文件并下载
function saveFile(solveContent) {
  // 处理文件成游戏格式
  var fileContent = read.createRadioData(solveContent.namelessField, solveContent.stations)
  console.log("处理后数据为：", fileContent)

  // 创建用于下载的元素
  const FileBlob = new Blob([fileContent]);
  const FileURL = URL.createObjectURL(FileBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = FileURL;
  downloadLink.download = "live_streams.sii";
  downloadLink.click();
  URL.revokeObjectURL(FileURL);
}

function delItemAll () {
  // const length = this.multipleSelection.length;
  // // console.log(multipleSelection)
  // for (let i = 0; i < length; i++) {
  //   console.log(this.multipleSelection[i])
  //   // console.log(this.solveContent.stations.find(this.multipleSelection[i]))
  // }
  // this.solveContent.stations = this.solveContent.stations.concat(multipleSelection)
  // var aa = [...new Set(this.solveContent.stations)]
  // console.log(this.solveContent.stations)
  this.solveContent.stations = []
  // console.log(aa)
  
}

// 删除表单项弹窗
const deleteItem = (index) => {
  ElMessageBox.confirm(
    '它将永久删除该文件。继续？',
    '警告',
    {
      type: 'warning',
      icon: markRaw(Delete),
      draggable: true,
    }
  )
    .then(() => {
      // 删除操作
      ref(solveContent.stations).value.splice(index, 1)
      // 弹出消息提示
      ElMessage({
        type: 'success',
        message: '已删除',
      })
    })
    .catch(() => {
      console.log('取消')
    })
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>