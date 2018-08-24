<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"> 单台清理</i></span>
          <el-select v-model="listQuery" placeholder="请选择服务器类型" class="filter-item" style="width: 280px">
            <el-option
              v-for="item in singleServersOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.display_name">
              <span style="float: left">{{ item.display_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.key }}</span>
            </el-option>
          </el-select>
          <el-button class="filter-item" type="success" icon="el-icon-success" style="margin-left: 10px; margin-bottom: 10px;" @click="singleOpenMsgbox">清理单台缓存</el-button>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"> 批量清理</i></span>
          <div style="line-height:300%;" >
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" border fill="#0000FF" style="margin-left: 10px; margin-bottom: 10px;" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkboxGroup1" @change="handleCheckedChange">
              <el-checkbox
                v-for="server in servers"
                :label="server"
                :key="server"
                style="margin-left: 10px; margin-bottom: 10px;"
                border>{{ server }}
              </el-checkbox>
            </el-checkbox-group>
            <el-button type="warning" icon="el-icon-share" style="margin-left: 10px; margin-bottom: 10px;" @click="muiltOpenMsgbox">批量清理缓存</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;min-height:1000px;">
      <el-table-column label="序号" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.datetime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="150px" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.info }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="动作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getLog, singleCleanCache, muiltCleanCache } from '@/api/siteCache'
import { mapGetters } from 'vuex'

const serverOptions = ['m.lifevc.com', 'www.lifevc.com', 'account.lifevc.com', 'marketing.lifevc.com', 'app.lifevc.com']

const singleServersOptions = [
  { key: 'm', display_name: 'm.lifevc.com' },
  { key: 'www', display_name: 'www.lifevc.com' },
  { key: 'account', display_name: 'account.lifevc.com' },
  { key: 'marketing', display_name: 'marketing.lifevc.com' },
  { key: 'app', display_name: 'app.lifevc.com' }
]

export default {
  filters: {
    statusFilter(status) {
      // alert(status)
      const statusMap = {
        success: 'success',
        running: 'warning',
        wating: 'info',
        error: 'danger'
      }
      // alert(statusMap[status])
      return statusMap[status]
    }
  },
  data() {
    return {
      listQuery: [],
      list: null,
      listLoading: true,
      checkAll: false,
      isIndeterminate: true,
      servers: serverOptions,
      checkboxGroup1: [],
      singleServersOptions
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.fetchLogData()
  },
  methods: {
    fetchLogData() {
      this.listLoading = true
      getLog().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    listCleanCache() {
      // const tempData = Object.assign({}, this.listQuery)
      this.listLoading = true
      // alert(JSON.stringify(tempData))
      singleCleanCache(this.listQuery).then(response => {
        // this.list = response.data.data.items
        // alert(JSON.stringify(response))
        if (response.code === 20000) {
          this.$message({
            message: '清理 ' + this.listQuery + ' 缓存任务提交成功',
            type: 'success',
            // center: true,
            showClose: true
          })
        } else {
          this.$message({
            message: '清理 ' + this.listQuery + ' 缓存任务提交失败 err :' + response.data.message,
            type: 'waring',
            // center: true,
            showClose: true
          })
        }
        this.fetchLogData()
        this.listLoading = false
      })
    },
    checkboxCleanCache() {
      this.listLoading = true
      // alert(JSON.stringify(this.checkboxGroup1))
      muiltCleanCache(this.checkboxGroup1).then(response => {
        // this.list = response.data.data.items
        // alert(JSON.stringify(response.data))
        this.$notify({
          title: '成功',
          message: '清理多个服务器缓存任务提交成功',
          type: 'success'
        })
      })
      this.fetchLogData()
      this.listLoading = false
    },
    handleCheckAllChange(val) {
      this.checkboxGroup1 = val ? serverOptions : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.servers.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.servers.length
    },
    singleOpenMsgbox() {
      this.$confirm('正在清理 [ ' + this.listQuery + ' ] 服务器缓存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listCleanCache()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    muiltOpenMsgbox() {
      this.$confirm('正在清理 [ ' + this.checkboxGroup1 + ' ] 服务器缓存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkboxCleanCache()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>
