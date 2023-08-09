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
  <el-button @click="delItemSelection()" type="primary">
    <el-icon>
      <Delete/>
    </el-icon>
    <span class="table-header-operate-text">批量删除</span>
  </el-button>

  <el-table :data="solveContent.stations" border :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }" :row-class-name="tableRowClassName" highlight-current-row
            @selection-change="handleSelectionChange" max-height="520" ref="dataTableRef">

    <!-- 表格列定义 -->
    <!-- 多选框 -->
    <el-table-column type="selection" width="55"/>
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
        <el-button link type="primary" size="small" @click.prevent="deleteItems(scope.$index)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
// 使用全局配置
import {useStore} from 'vuex';
// 使用解析scs电台文件核心库
import core from '../js/Core'
// Vue
import {ref, markRaw} from 'vue'
// Vue弹窗和图标
import {ElMessage, ElMessageBox} from 'element-plus'
import {Delete} from '@element-plus/icons-vue'

// 调用父组件(App.vue)的changePage(newPage)函数来切换页面
const emit = defineEmits(['changePage'])
const changePage = (newPage) => {
  emit('changePage', newPage)
}

// 表格预定义
const dataTableRef = ref()

// 设置选中项
const setCurrent = (row) => {
  if (row) {
    dataTableRef.value.toggleRowSelection(row)
  } else {
    dataTableRef.value.clearSelection()
  }
}

const columns = [
  // 表格列定义
  {prop: 'liked', label: '⭐'},
  {prop: 'name', label: '名称'},
  {prop: 'genre', label: '流派'},
  {prop: 'country', label: '语言'},
  {prop: 'bitrate', label: '比特率'},
  {prop: 'url', label: 'URL'},
]

function tableRowClassName({rowIndex}) {
  if (rowIndex === 1) {
    return 'warning-row';
  } else if (rowIndex === 3) {
    return 'success-row';
  }
  return '';
}

const store = useStore();
// 文件内容等于全局配置的内容
const fileContent = store.state.fileContent;

// 文件内容解析
const solveContent = core.parseRadioData(fileContent)

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
  const fileContent = core.createRadioData(solveContent.namelessField, solveContent.stations);
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


// 选择了的数据
let multipleSelection = []

// 选中时
function handleSelectionChange(val) {
  console.log('选中数据 => ', val)
  multipleSelection = []
  for (let item of val) {
    multipleSelection.push(item.id)
  }
}

// 删除所有选中内容
function delItemSelection() {
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
        for (let i of multipleSelection) {
          deleteItem(solveContent.stations.findIndex(item => item.id === i))
        }
        setCurrent()
      })
      .catch(() => {
        console.log('取消删除选中项')
      })
}

// 删除单个项函数
const deleteItems = (index) => {
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
        deleteItem(index)
      })
      .catch(() => {
        console.log('取消')
      })
}

// 删除单项操作
const deleteItem = (index) => {
  try {
    // 删除操作
    ref(solveContent.stations).value.splice(index, 1)
    // 消息提示
    ElMessage({
      type: 'success',
      message: '已删除',
    })
    return true
  } catch (e) {
    // 消息提示
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
  return false
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