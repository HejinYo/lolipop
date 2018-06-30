<template>
  <div>
    <Row :gutter="5">
      <i-Col :xs="24" :sm="10" :md="10" :lg="6">
        <Card>
          <p slot="title">资源树</p>
          <div>
            <operate-tree
              :data="operateTreeData"
              node-key="resId"
              label="resName"
              icon="icon"
              :accordion="false"
              default-expand-all
              @node-drop="handleDrop"
              @node-click="nodeClick"
            >
            </operate-tree>
          </div>
        </Card>
      </i-Col>

      <i-Col :xs="24" :sm="14" :md="14" :lg="18">
        <div>
          <Card>
            <Row v-if="advancedSearch">
              <!-- 高级查询 -->
              <Card :dis-hover="true">
                <Form ref="queryParam" :model="queryParam" :label-width="80" class="search">
                  <Row>
                    <FormItem label="资源名称:" prop="resName">
                      <Input v-model="queryParam.resName"></Input>
                    </FormItem>
                    <FormItem label="状态:" prop="state">
                      <Select v-model="queryParam.state">
                        <Option value="0">启用</Option>
                        <Option value="1">禁用</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="创建时间:" prop="createTime">
                      <DatePicker v-model="queryParam.createTime" type="date" @on-change="dateHandleChange"></DatePicker>
                    </FormItem>
                  </Row>
                </Form>
              </Card>
              <br/>
            </Row>
            <!--操作工具条-->
            <Row>
              <i-Col :xs="24" :sm="12" :md="14" :lg="16">
                <Button type="primary" icon="android-add">添加</Button>
                <Button type="primary" icon="edit">修改</Button>
                <Button type="error" icon="android-delete">删除</Button>
              </i-Col>

              <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                <i-Input v-model="pageQuery.queryValue" :disabled="advancedSearch" @on-enter="search" placeholder="查询..." :maxlength="32" clearable>
                  <Select v-model="pageQuery.queryKey" :disabled="advancedSearch" @on-change="search" slot="prepend" style="width: 80px">
                    <Option value="resName">资源名称</Option>
                    <Option value="resCode">资源编号</Option>
                  </Select>
                  <Button slot="append" @click="search">
                    <Icon type="ios-search-strong"></Icon>
                  </Button>
                  <Button slot="append" @click="searchRset">重置</Button>
                  <Button slot="append" @click="advancedSearch = !advancedSearch">
                    <Icon :type=" advancedSearch ? 'chevron-up' : 'chevron-down' "></Icon>
                  </Button>
                </i-Input>
              </i-Col>
            </Row>
            <br/>

            <el-table stripe border highlight-current-row size="mini" element-loading-text="拼命加载中"
                      :data="listData" v-loading="listLoading" :height="clientHeight-250"
                      @row-click="rowClick" @row-dblclick="rowDbClick" @sort-change="sortChange">
              <el-table-column prop="resId" label="编号" sortable="custom" align="center" width="70"></el-table-column>
              <el-table-column prop="resType" label="类型" sortable="custom" align="center" width="90">
                <template slot-scope="scope">
                  <Tag :color="scope.row.resType === 0 ? 'green': 'blue' ">
                    {{scope.row.resType === 0 ? '文件夹' : '菜单'}}
                  </Tag>
                </template>
              </el-table-column>
              <el-table-column prop="resName" label="资源名称" sortable="custom" align="center" min-width="150"></el-table-column>
              <el-table-column prop="resCode" label="资源编码" sortable="custom" align="center" min-width="150"></el-table-column>
              <!--<el-table-column prop="resPname" label="上级资源" sortable="custom" align="center" min-width="150"></el-table-column>-->
              <el-table-column prop="resIcon" label="图标" show-overflow-tooltip align="center" width="70">
                <template slot-scope="scope">
                  <Icon :type="scope.row.icon" :size="16"></Icon>
                </template>
              </el-table-column>
              <el-table-column prop="seq" sortable="custom" label="序号" align="center" width="70"></el-table-column>
              <el-table-column prop="state" sortable="custom" label="状态" align="center" width="90">
                <template slot-scope="scope">
                  <Tag :color="scope.row.state === 0 ? 'green': 'red' ">
                    {{scope.row.state === 0 ? '正常' : '禁用'}}
                  </Tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" sortable="custom" label="创建日期" align="center" width="160"></el-table-column>
            </el-table>
            <br/>
            <!--翻页工具条-->
            <Page show-elevator show-total show-sizer size="small" placement="top"
                  :total="pageParam.total"
                  :current="pageParam.pageNum===0?1:pageParam.pageNum"
                  :page-size="pageParam.pageSize"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange"
                  @on-page-size-change="sizeChange">
            </Page>
          </Card>
        </div>
      </i-Col>
    </Row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import OperateTree from '@/components/operate-tree'
  import { reqResourceOperateTree, reqResourceListPage } from '@/api/resource.js'

  export default {
    name: 'sys-resource',
    components: {
      OperateTree
    },
    computed: {
      ...mapGetters([
        'clientHeight'
      ])
    },
    data () {
      return {
        triggerOffset: '300px',
        // 操作树数据
        operateTreeData: [],
        // 表格加载
        listLoading: false,
        // 表格数据
        listData: [],
        // 当前选择行
        currCol: null,
        // 高级查询
        advancedSearch: false,
        // 高级查询参数
        queryParam: {
          resName: null,
          state: null,
          createTime: null
        },
        // 查询参数
        pageQuery: {
          queryTree: null,
          queryKey: 'resName',
          queryValue: null
        },
        // 分页查询参数
        pageParam: {
          total: 0,
          pageNum: 1,
          pageSize: 50,
          sidx: null,
          sort: null
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        // 保证完全挂载
        this.loadTreeData()
        this.loadListPage()
      })
    },
    methods: {
      test (val) {
        alert(val)
      },
      loadTreeData () {
        reqResourceOperateTree().then((data) => {
          let {code, result} = data
          if (code === 0) {
            this.operateTreeData = result.tree
          }
        })
      },
      loadListPage () {
        let method = this.advancedSearch ? 'post' : 'get'
        let params = this.advancedSearch ? this.pageParam : {...this.pageParam, ...this.pageQuery}
        reqResourceListPage(method, this.queryParam, params).then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.currCol = null
            this.listData = result.list
            this.pageParam.total = result.total
            this.pageParam.pageNum = result.pageNum
          } else {
            this.$Message.warning(msg)
          }
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        })
      },
      // 表格行点击
      rowClick (data) {
        this.currCol = data
      },
      // 表格行双击
      rowDbClick (data) {

      },
      // 表格排序
      sortChange (val) {
        this.pageParam.sidx = val.prop
        this.pageParam.sort = val.order
        this.loadListPage()
      },
      // 翻页
      pageChange (val) {
        this.pageParam.pageNum = val
        this.loadListPage()
      },
      // 改变分页大小
      sizeChange (val) {
        this.pageParam.pageSize = val
        this.loadListPage()
      },
      // iview大坑，时间选择器默认使用utc，不能使用v-model绑定
      dateHandleChange (value) {
        this.queryParam.createTime = value
      },
      // 重置表格
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 查询
      search () {
        if (this.advancedSearch || this.pageQuery.queryValue) {
          this.loadListPage()
        }
      },
      // 查询重置
      searchRset () {
        if (this.advancedSearch) {
          this.resetForm('queryParam')
        } else {
          this.pageQuery.queryValue = null
        }
        this.loadListPage()
      },
      // 被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event
      handleDrop (node, innerNode, location, event) {
        switch (location) {
          case 'before':
            console.log('节点前')
            break
          case 'after':
            console.log('节点后')
            break
          case 'inner':
            console.log('插入节点')
            break
        }
        console.log('node:', node)
        console.log('innerNode:', innerNode)
      },
      // 树节点点击
      nodeClick (data, node, ref) {
        this.pageQuery.queryTree = data.resId === 1 ? null : data.resId
        this.loadListPage()
      }
    }
  }
</script>
