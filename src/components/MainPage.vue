<template>
  <!-- 导入按钮 -->
  <el-button type="primary" @click="changePage('UploadPage')">
    <el-icon>
      <i-ep-DocumentAdd/>
    </el-icon>
    <span class="table-header-operate-text">导入</span>
  </el-button>

  <!-- 新增按钮 在头部新增-->
  <el-button
      type="success"
      @click="solveContent.stations.unshift({url: '链接', name: '名称', genre: '流派', country: '国家', bitrate: 64, liked: false})">
    <el-icon>
      <i-ep-Plus/>
    </el-icon>
    <span class="table-header-operate-text">新增</span>
  </el-button>

  <!-- 保存按钮 -->
  <el-button type="warning" @click="saveFile(solveContent)">
    <el-icon>
      <i-ep-Download/>
    </el-icon>
    <span class="table-header-operate-text">保存</span>
  </el-button>

  <!-- 批量删除按钮 -->
  <el-button type="danger" @click="delItemSelection()">
    <el-icon>
      <i-ep-Delete/>
    </el-icon>
    <span class="table-header-operate-text">批量删除</span>
  </el-button>

  <!-- 蜻蜓fm按钮 -->
  <el-button type="info" @click="qingtingfmDialogFormVisible = true">
    <el-icon>
      <i-ep-Headset/>
    </el-icon>
    <span class="table-header-operate-text">蜻蜓fm</span>
  </el-button>

  <!--版本标志-->
  <el-badge class="item" value="2.0.1.202309091746">
    Version
  </el-badge>

  <el-table ref="dataTableRef" :cell-style="{ 'text-align': 'center' }" :data="solveContent.stations"
            :header-cell-style="{ 'text-align': 'center' }" :row-class-name="tableRowClassName" border
            highlight-current-row max-height="520" @selection-change="handleSelectionChange">

    <!-- 表格列定义 -->
    <!-- 多选框 -->
    <el-table-column type="selection" width="55"/>
    <!-- 数据 -->
    <el-table-column v-for="(item, index) in columnsShow" :key="index" :label="item.label" :prop="item.prop"
                     :fit="true" :width="item.width">
      <!-- 星星替换 -->
      <template v-if="item.prop === 'liked'" v-slot="{ row }">
        <a v-if="row.liked">⭐</a>
        <a v-else>⛤</a>
      </template>
      <!-- URL试听列 -->
      <template v-if="item.prop === 'url_listen'" v-slot="{ row }">
        <audio controls>
          <source :src="row.url" type="audio/mpeg">
          您的浏览器不支持 audio 元素。
        </audio>
      </template>
    </el-table-column>
    <!-- 删除框 -->
    <el-table-column fixed="right" label="操作" width="true">
      <template #default="scope">
        <el-button link size="small" type="primary" @click.prevent="editDialogFormVisible = true; Item = scope.$index">
          编辑
        </el-button>
        <el-button link size="small" type="primary" @click.prevent="deleteItems(scope.$index)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 编辑 -->
  <el-dialog v-model="editDialogFormVisible" draggable title="请编辑您的电台信息">
    <el-form :model="solveContent.stations">
      <el-space fill>
        <!-- 可编辑内容 -->
        <el-form-item v-for="(item, index) in columnsEdit" :key="index" :label="item.label"
                      :label-width="formLabelWidth"
                      :prop="item.prop">
          <!-- 输入框 -->
          <el-input v-if="item.prop !== 'liked'" v-model="solveContent.stations[Item][item.prop]" autocomplete="off"/>
          <!--收藏开关-->
          <el-switch v-if="item.prop === 'liked'"
                     v-model="solveContent.stations[Item][item.prop]"
                     active-text="⭐"

                     inactive-text="⛤"
                     inline-prompt/>
        </el-form-item>
      </el-space>
    </el-form>
  </el-dialog>

  <!-- 蜻蜓fm -->
  <el-dialog v-model="qingtingfmDialogFormVisible" draggable title="请输入蜻蜓fm的电台页URL">
    <!--    电台信息 跨域问题暂不使用-->
    <!--    <div>-->
    <!--    <el-image style="width: 100px; height: 100px" :src="radioPicUrl" :fit="fill" />-->
    <!--    </div>-->
    <el-form>
      <!-- 输入内容-->
      <el-form-item>
        <el-form-item :label-width="225" label="电台页URL">
          <el-input v-model="qingtingfmRadioURL" autocomplete="off" @change="getRadioRawURL(qingtingfmRadioURL)"/>
        </el-form-item>
        <el-form-item :label-width="225" label="电台URL">
          <el-input v-model="qingtingfmRadioRawURL" autocomplete="off"/>
        </el-form-item>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
// 使用全局配置
import {useStore} from "@/store";
// 使用解析scs电台文件核心库
import core from '../js/Core'
// Icon
import {Delete} from '@element-plus/icons-vue'

// 当前项
const Item = ref(0)
// 调用父组件(App.vue)的changePage(newPage)函数来切换页面
const emit = defineEmits(['changePage'])
const changePage = (newPage) => {
  emit('changePage', newPage)
}

// 编辑框
const editDialogFormVisible = ref(false)
const formLabelWidth = '140px'

// 蜻蜓fm
const qingtingfmDialogFormVisible = ref(false)
// const qingtingfmRadioURL = ref('https://www.qingting.fm/radios/1262')
// let qingtingfmRadioRawURL = ref('https://lhttp.qtfm.cn/live/1262/64k.mp3')
const qingtingfmRadioURL = ref('')
let qingtingfmRadioRawURL = ref('')
const getRadioRawURL = (URL) => {
  if (URL) {
    let URL_Head = 'https://www.qingting.fm/radios/'
    console.log(URL.includes(URL_Head))
    if (URL.includes(URL_Head)) {
      let channel_id = URL.replace(URL_Head, '').replace('/', '')
      console.log(channel_id)
      qingtingfmRadioRawURL.value = core.getLiveUrl(channel_id)
      // 跨域了
      // axios.get(`https://webapi.qingting.fm/api/pc/radio/${channel_id}`).then((res)=>{
      //   console.log(res)
      // })
    } else {
      qingtingfmRadioRawURL.value = '电台页链接有误，请检查！'
    }
    console.log("转换的电台直链:", qingtingfmRadioRawURL.value)
  }
}
// 电台图片
// const radioPicUrl = ref('http://pic.qtfm.cn/2016/0627/2016062715553137.png')

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

const columnsShow = [
  // 展示表格列定义
  {prop: 'liked', label: '⭐', width: '45px'}, // 设置宽度为45px
  {prop: 'name', label: '名称', width: '150px'}, // 设置宽度为150px
  {prop: 'genre', label: '流派', width: '100px'}, // 设置宽度为100px
  {prop: 'country', label: '语言', width: '100px'}, // 设置宽度为100px
  {prop: 'bitrate', label: '比特率', width: '80px'}, // 设置宽度为80px
  {prop: 'url', label: 'URL', width: '288px'}, // 设置宽度为288px
  {prop: 'url_listen', label: 'URL试听', width: '325px'} // 设置宽度为150px
]
const columnsEdit = [
  // 编辑窗口列定义
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
const fileContent = store.fileContent;

// 文件内容解析
const solveContent = ref(core.parseRadioData(fileContent))

// 表格数据导入
try {
  if (solveContent && Array.isArray(solveContent.value.stations)) {
    console.log('当前文件数据：', solveContent.value)
  }
} catch (error) {
  console.error('解析文件内容失败：', error);
}

// 保存文件并下载
function saveFile(solveContent) {
  // 处理文件成游戏格式
  // 不再使用玩家自己传的namelessField 使用游戏默认的
  const fileContent = core.createRadioData(solveContent.stations);
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
        // 定义一个状态 默认是执行成功的
        let batchDeleteStatus = true
        for (let i of multipleSelection) {
          // 如果有任何一次删除失败
          if (!deleteItem(solveContent.value.stations.findIndex(item => item.id === i))) {
            // 设置批量删除状态为false
            batchDeleteStatus = false
          }
        }
        setCurrent()
        showDelMessage(batchDeleteStatus)
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
        showDelMessage(deleteItem(index))
      })
      .catch(() => {
        console.log('取消')
      })
}

// 删除单项操作
const deleteItem = (index) => {
  try {
    // 删除操作
    ref(solveContent.value.stations).value.splice(index, 1)
    return true
  } catch (e) {
    return false
  }
  return false
}

const showDelMessage = (status) => {
  if (status) {
    // 消息提示
    ElMessage({
      type: 'success',
      message: '已删除',
    })
  } else {
    // 消息提示
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
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