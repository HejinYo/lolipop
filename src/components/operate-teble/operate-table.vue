<template>
  <div>
    <Row :gutter="5">
      <Card :padding="0">
        <p slot="title">
          {{tableTitle}}
        </p>
        <div>
          <Card :bordered="false">
            <Row>
              <!--操作工具条-->
              <i-Col :xs="24" :sm="12" :md="14" :lg="16">
                <Button type="primary" icon="md-add-circle" @click="addData" v-if="tableAdd">添加</Button>
                <Button type="primary" icon="md-create" :disabled="editVisible" @click="editData" v-if="tableEdit">修改</Button>
                <Button type="error" icon="md-trash" :disabled="delVisible" @click="delData" v-if="tableDel">删除</Button>
                <!-- 自定义按钮组 -->
                <slot name="button"></slot>
              </i-Col>
              <!-- 简单查询 -->
              <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                <i-Input v-model="pageQuery.queryValue" on-enter="search" placeholder="查询..." :maxlength="32">
                  <Select v-model="pageQuery.queryKey" @on-change="search" slot="prepend" style="width: 80px">
                    <Option v-for="item in searchData" :value="item.value" :label="item.label" :key="item.value"></Option>
                  </Select>
                  <Button slot="append" @click="search">
                    <Icon type="ios-search"></Icon>
                  </Button>
                  <Button slot="append" @click="searchRset">
                    <Icon type="md-refresh"></Icon>
                  </Button>
                </i-Input>
              </i-Col>
            </Row>
            <br>
            <Row>
              <!-- 表格 -->
              <slot name="table" :height="clientHeight"></slot>
              <br/>
              <Page show-elevator show-total show-sizer size="small" placement="top"
                    :total="pageParam.total"
                    :current="pageParam.pageNum===0 ? 1: pageParam.pageNum"
                    :page-size="pageParam.pageSize"
                    :page-size-opts="[10,20,50,100]"
                    @on-change="pageChange"
                    @on-page-size-change="sizeChange">
              </Page>
            </Row>
          </Card>
        </div>
      </Card>
    </Row>
  </div>

</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'operate-table',
    computed: {
      ...mapGetters([
        'clientHeight'
      ]),
      // 编辑按钮 disable
      editVisible () {
        return this.currCol == null
      },
      // 删除按钮 disable
      delVisible () {
        return this.currCol == null
      }
    },
    props: {
      // 表格标题
      tableTitle: {
        type: String,
        default: '操作表格'
      },
      // 表格数据
      tableData: {
        request: true,
        type: Array
      },
      queryTree: {
        type: String
      },
      queryKey: {
        type: String
      },
      total: {
        type: Number,
        default: 0
      },
      pageNum: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 10
      },
      searchData: {
        type: Array,
        default: () => {
          return []
        }
      },
      // 显示添加按钮
      tableAdd: {
        type: Boolean,
        default: false
      },
      // 显示编辑按钮
      tableEdit: {
        type: Boolean,
        default: false
      },
      // 显示删除按钮
      tableDel: {
        type: Boolean,
        default: false
      },
      // 当前选择行
      currCol: null,
      // 分页查询参数
      pageParam: {
        default: () => {
          return {
            total: 0,
            pageNum: 1,
            pageSize: 10
          }
        }
      }
    },
    data () {
      return {
        // 表格加载
        listLoading: false,
        // 简单查询参数
        pageQuery: {
          queryTree: '',
          queryKey: '',
          queryValue: null
        }
      }
    },
    mounted () {
      // 保证完全挂载
      this.$nextTick(function () {
        this.pageQuery.queryTree = this.queryTree
        this.pageQuery.queryKey = this.queryKey
        this.loadListPage()
      })
    },
    watch: {
      queryTree (val) {
        this.pageQuery.queryTree = val
      },
      queryKey (val) {
        this.pageQuery.queryKey = val
      },
      total (val) {
        this.pageParam.total = val
      },
      pageNum (val) {
        this.pageParam.pageNum = val
      },
      pageSize (val) {
        this.pageParam.pageSize = val
      }
    },
    methods: {
      // 加载表格数据
      loadListPage () {
        this.$emit('load-list-page', this.pageParam, this.pageQuery)
      },
      // 添加按钮
      addData () {
        this.$emit('table-add')
      },
      // 编辑按钮
      editData () {
        this.$emit('table-edit')
      },
      // 删除按钮
      delData () {
        this.$emit('table-del')
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
      // 查询
      search () {
        if (this.pageQuery.queryValue) {
          this.loadListPage()
          this.$emit('search')
        }
      },
      // 查询重置
      searchRset () {
        this.pageQuery.queryValue = null
        this.loadListPage()
        this.$emit('search-reset')
      }

    }
  }
</script>
