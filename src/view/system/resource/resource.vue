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
              @node-add="addData"
              @node-edit="editData"
            >
            </operate-tree>
          </div>
        </Card>
      </i-Col>

      <i-Col :xs="24" :sm="14" :md="14" :lg="18">
        <Card :padding="0">
          <p slot="title">
            {{tableShow}}
          </p>
          <a href="#" slot="extra" @click.prevent="chageTable">
            <Icon type="ios-loop-strong"></Icon>
            切换
          </a>
          <div>
            <Card :bordered="false">
              <!--操作工具条-->
              <Row>
                <i-Col :xs="24" :sm="12" :md="14" :lg="16">
                  <!--<Button type="primary" icon="android-add" @click="addData">添加</Button>-->
                  <Button type="primary" icon="edit">修改</Button>
                  <Button type="error" icon="android-delete">删除</Button>
                </i-Col>

                <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                  <i-Input v-model="pageQuery.queryValue" on-enter="search" placeholder="查询..." :maxlength="32">
                    <Select v-model="pageQuery.queryKey" @on-change="search" slot="prepend" style="width: 80px">
                      <template v-if="tableType === 0">
                        <Option value="resName">资源名称</Option>
                        <Option value="resCode">资源编码</Option>
                      </template>
                      <template v-if="tableType === 1">
                        <Option value="permName">权限名称</Option>
                        <Option value="permCode">权限编码</Option>
                      </template>
                    </Select>
                    <Button slot="append" @click="search">
                      <Icon type="ios-search-strong"></Icon>
                    </Button>
                    <Button slot="append" @click="searchRset">
                      <Icon type="ios-loop-strong"></Icon>
                    </Button>
                  </i-Input>
                </i-Col>
              </Row>
              <br/>
              <div>
                <div>
                  <!-- 资源表格 -->
                  <el-table v-if="tableType === 0" stripe border highlight-current-row size="mini" element-loading-text="拼命加载中"
                            :data="listData" v-loading="listLoading" :height="clientHeight-303"
                            @row-click="rowClick" @row-dblclick="rowDbClick" @sort-change="sortChange">
                    <el-table-column prop="resId" label="编号" sortable="custom" align="center" width="70"></el-table-column>
                    <el-table-column prop="resName" label="资源名称" sortable="custom" align="center" min-width="150"></el-table-column>
                    <el-table-column prop="resCode" label="资源编码" sortable="custom" align="center" min-width="150"></el-table-column>
                    <!--<el-table-column prop="resPname" label="上级资源" sortable="custom" align="center" min-width="150"></el-table-column>-->
                    <el-table-column prop="icon" label="图标" show-overflow-tooltip align="center" width="70">
                      <template slot-scope="scope">
                        <Icon :type="scope.row.icon" :size="16"></Icon>
                      </template>
                    </el-table-column>
                    <el-table-column prop="seq" sortable="custom" label="序号" align="center" width="70"></el-table-column>
                    <el-table-column prop="type" label="类型" sortable="custom" align="center" width="90">
                      <template slot-scope="scope">
                        <dict-show code="RESOURCE_TYPE" :dictValue="scope.row.type"></dict-show>
                      </template>
                    </el-table-column>
                    <el-table-column prop="state" sortable="custom" label="状态" align="center" width="90">
                      <template slot-scope="scope">
                        <Tag :color="scope.row.state === 0 ? 'green': 'red' ">
                          {{scope.row.state === 0 ? '正常' : '禁用'}}
                        </Tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" sortable="custom" label="创建日期" align="center" width="160"></el-table-column>
                  </el-table>
                </div>
                <div>
                  <!-- 权限表格 -->
                  <el-table v-if="tableType === 1" stripe border highlight-current-row size="mini" element-loading-text="拼命加载中"
                            :data="listData" v-loading="listLoading" :height="clientHeight-303"
                            @row-click="rowClick" @row-dblclick="rowDbClick" @sort-change="sortChange">
                    <el-table-column prop="permId" label="编号" sortable="custom" align="center" width="70"></el-table-column>
                    <el-table-column prop="resName" label="资源名称" sortable="custom" align="center" min-width="150"></el-table-column>
                    <el-table-column prop="permName" label="权限名称" sortable="custom" align="center" min-width="150"></el-table-column>
                    <el-table-column prop="permCode" label="权限编码" sortable="custom" align="center" min-width="150"></el-table-column>
                    <el-table-column prop="state" sortable="custom" label="状态" align="center" width="90">
                      <template slot-scope="scope">
                        <Tag :color="scope.row.state === 0 ? 'green': 'red' ">
                          {{scope.row.state === 0 ? '正常' : '禁用'}}
                        </Tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" sortable="custom" label="创建日期" align="center" width="160"></el-table-column>
                  </el-table>
                </div>

              </div>
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
        </Card>
      </i-Col>
    </Row>

    <!-- 资源表单 -->
    <Modal :mask-closable="false" v-model="formVisible" :title="formShow">
      <Form ref="formData" :model="formData" :rules="formValidate" :label-width="80">
        <FormItem label="上级资源：" prop="parentName">
          <i-Input v-model="formData.parentName" readonly></i-Input>
          <i-Input v-model="formData.parentId" v-show="false"></i-Input>
        </FormItem>
        <FormItem label="资源类型：" prop="type">
          <dict-select type="radio" code="RESOURCE_TYPE" v-bind:model.sync="formData.type"></dict-select>
        </FormItem>
        <FormItem label="资源名称：" prop="resName">
          <Input v-model="formData.resName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="资源编码：" prop="resCode">
          <i-Input v-model="formData.resCode" placeholder="请输入"></i-Input>
        </FormItem>
        <FormItem label="资源图标：" prop="icon">
          <icon-pane v-bind:icon.sync="formData.icon"></icon-pane>
        </FormItem>
        <FormItem label="排序号：" prop="seq">
          <InputNumber :max="100" :min="1" v-model="formData.seq"></InputNumber>
        </FormItem>
        <FormItem label="状态：" prop="state">
          <i-switch v-model="formData.state" size="large" :true-value="0" :false-value="1">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="formVisible = false">取 消</Button>
        <Button type="primary">确 定</Button>
      </div>
    </Modal>

    <!-- 权限表单 -->
    <Modal :mask-closable="false" v-model="permVisible" :title="formShow">
      <Form ref="sysPermission" :model="sysPermission" :rules="permValidate" :label-width="80">
        <FormItem label="所属资源" prop="resId">
          <i-Input v-model="sysPermission.resName" readonly></i-Input>
          <i-Input v-model="sysPermission.resId" v-show="false"></i-Input>
        </FormItem>
        <FormItem label="权限名称" prop="permName">
          <i-Input v-model="sysPermission.permName" placeholder="请输入"></i-Input>
        </FormItem>
        <FormItem label="权限编码" prop="permCode">
          <i-Input v-model="sysPermission.permCode" placeholder="请输入"></i-Input>
        </FormItem>
        <FormItem label="状态" prop="state">
          <i-switch v-model="sysPermission.state" size="large" :true-value="0" :false-value="1">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="permVisible = false">取 消</Button>
        <Button type="primary">确 定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import OperateTree from '@/components/operate-tree'
  import IconPane from '@/components/icon-pane'
  import DictShow from '@/components/dict-show'
  import DictSelect from '@/components/dict-select'
  import { reqResourceOperateTree, reqResourceListPage, reqRermissionListPage } from '@/api/resource.js'
  import system from '@/api/system'

  export default {
    name: 'sys-resource',
    components: {
      OperateTree,
      IconPane,
      DictShow,
      DictSelect
    },
    computed: {
      ...mapGetters([
        'clientHeight'
      ]),
      // 表格标题显示
      tableShow () {
        switch (this.tableType) {
          case 0:
            return '资源管理'
          case 1:
            return '权限管理'
        }
      },
      // 表单标题显示
      formShow () {
        switch (this.tableType) {
          case 0:
            return this.operteType === 0 ? '资源添加' : '资源修改'
          case 1:
            return this.operteType === 0 ? '权限添加' : '权限修改'
        }
      }
    },
    data () {
      return {
        // 切换操作不同表格 0：资源管理 1：权限管理
        tableType: 0,
        // 表单操作类型 0：添加1：修改
        operteType: 0,
        // 操作树数据
        operateTreeData: [],
        // 操作数据列表
        operateListData: [],
        // 表格加载
        listLoading: false,
        // 表格数据
        listData: [],
        // 当前选择行
        currCol: null,
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
          pageSize: 20,
          sidx: null,
          sort: null
        },
        // 显示表单标识
        formVisible: false,
        // 表单模型
        formData: {
          parentId: null,
          parentName: null,
          type: null,
          icon: null,
          seq: null
        },
        // 表单添加初始化
        formAdd: {
          parentId: 0,
          parentName: '',
          type: 0,
          icon: '',
          seq: 0
        },
        // 表单验证
        formValidate: {},
        // 权限表单标识
        permVisible: false,
        // 权限表单模型
        sysPermission: {
          resId: null,
          resName: null,
          permName: null,
          permCode: null,
          state: null
        },
        // 权限表单添加初始化
        addPermission: {
          resId: null,
          resName: '',
          permName: '',
          permCode: '',
          state: 0
        },
        // 权限表单验证
        permValidate: {
          permName: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          permCode: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
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
      // 切换操作表格
      chageTable () {
        switch (this.tableType) {
          case 0:
            this.tableType = 1
            this.pageQuery.queryKey = 'permCode'
            break
          case 1:
            this.tableType = 0
            this.pageQuery.queryKey = 'resName'
        }
        this.currCol = null
        this.listData = []
        this.pageParam.total = 0
        this.pageParam.pageNum = 1
        this.pageParam.sidx = null
        this.pageParam.sort = null
        this.loadListPage()
      },
      loadTreeData () {
        reqResourceOperateTree().then((data) => {
          let {code, result} = data
          if (code === 0) {
            this.operateTreeData = result.tree
            this.operateListData = result.list
          }
        })
      },
      loadListPage () {
        this.listLoading = true
        let method = 'get'
        let params = {...this.pageParam, ...this.pageQuery}
        if (this.tableType === 0) {
          // 加载资源表格
          reqResourceListPage(method, params).then(data => {
            this.processListData(data)
          })
        } else {
          // 加载权限表格
          reqRermissionListPage(method, params).then(data => {
            this.processListData(data)
          })
        }
      },
      // 处理表格数据
      processListData (data) {
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
      // 重置表格
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 查询
      search () {
        if (this.pageQuery.queryValue) {
          this.loadListPage()
        }
      },
      // 查询重置
      searchRset () {
        this.pageQuery.queryValue = null
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
      },
      // 添加
      addData (data, node) {
        if (this.tableType === 0) {
          this.formVisible = true
          this.formData = JSON.parse(JSON.stringify(this.formAdd))

          let children = data.children
          if (children.length > 0) {
            this.formData.seq = children[children.length - 1].seq * 1 + 1
          } else {
            this.formData.seq = 1
          }
          this.formData.parentId = data.resId
          this.formData.parentName = data.resName
          this.formData.type = data.type
          this.formData.icon = data.icon
          this.formData.state = data.state
        } else {
          this.permVisible = true
          this.sysPermission.resId = data.resId
          this.sysPermission.resName = data.resName
        }
      },
      // 编辑
      editData (data, node) {
        this.formVisible = true
        system.getResourceInfo(data.resId).then((resData) => {
          let {code, msg, result} = resData
          if (code === 0) {
            this.formData = result
            for (let item of this.operateListData) {
              if (this.formData.parentId === item.resId) {
                this.formData.parentName = item.resName
                break
              }
            }
          } else {
            this.$Message.info(msg)
          }
        })
      }
    }
  }
</script>
