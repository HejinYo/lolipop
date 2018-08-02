<template>
  <div>
    <operate-table tableTitle="日志管理"
                   :pageParam="pageParam" queryKey="params"
                   @load-list-page="loadListPage"
                   ref="operateTable"
                   :currCol="currCol"
                   :searchData="searchData">
      <template slot-scope="{height}" slot="table">
        <el-table stripe border highlight-current-row size="mini" element-loading-text="拼命加载中"
                  :data="tableData" v-loading="listLoading" :height="height-303"
                  @row-click="rowClick" @row-dblclick="rowDbClick" @sort-change="sortChange">
          <el-table-column prop="id" label="配置ID" sortable="custom" align="center" width="90"></el-table-column>
          <el-table-column prop="operation" label="操作" sortable="custom" align="center" width="120"></el-table-column>
          <el-table-column prop="method" label="执行方法" sortable="custom" min-width="90" show-overflow-tooltip></el-table-column>
          <el-table-column prop="params" label="参数" sortable="custom" min-width="90">
            <template slot-scope="scope">
              <json-view :value="scope.row.params" placement="left-end">
                <span slot="button">
                  {{scope.row.params}}
                </span>
              </json-view>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="姓名" sortable="custom" align="center" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建日期" sortable="custom" align="center" width="160"></el-table-column>
        </el-table>
      </template>
    </operate-table>
  </div>

</template>
<script>
  import OperateTable from '@/components/operate-teble'
  import JsonView from '@/components/json-view'
  import LogApi from '@/api/system/log-api'

  export default {
    name: 'sys-log',
    components: {
      OperateTable,
      JsonView
    },
    data () {
      return {
        tableData: [],
        // 分页查询参数
        pageParam: {
          total: 0,
          pageNum: 1,
          pageSize: 20
        },
        // 表格加载
        listLoading: false,
        // 当前选择行
        currCol: null,
        searchData: [
          {label: '操作', value: 'operation'},
          {label: '执行', value: 'method'},
          {label: '参数', value: 'params'},
          {label: '姓名', value: 'userName'}
        ]
      }
    },
    mounted () {
      this.$nextTick(function () {
        // 保证完全挂载
      })
    },
    methods: {
      loadListPage (pageParam, pageQuery) {
        this.listLoading = true
        // 默认排序
        if (pageParam.sidx === undefined || pageParam.sidx === null) {
          pageParam.sidx = 'id'
          pageParam.sort = 'desc'
        }
        LogApi.reqLogListPage('get', {...pageParam, ...pageQuery}).then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.currCol = null
            this.tableData = result.list
            this.pageParam.total = result.total
            this.pageParam.pageNum = result.pageNum
          } else {
            this.$Message.error(msg)
          }
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        })
      },
      rowClick (val) {
        this.currCol = val
      },
      rowDbClick (val) {

      },
      sortChange (val) {
        this.$refs.operateTable.sortChange(val)
      }
    }
  }
</script>
