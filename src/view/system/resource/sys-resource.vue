<template>
  <div>
    <Row :gutter="5">
      <i-Col :xs="24" :sm="10" :md="10" :lg="6">
        <Card>
          <p slot="title">资源树</p>
          <div>
            <operate-tree
              ref="operateTree"
              :data="operateTreeData"
              value="resId"
              label="resName"
              icon="icon"
              :expandedKeys="operateExpandedKeys"
              :accordion="false"
              :draggable="true"
              @node-drop="handleDrop"
              @node-click="nodeClick"
              :rootAddShow="true"
              @root-add="addRoot"
              @root-load="loadRoot"
              @node-add="addData"
              @node-edit="treeEdit"
              @node-del="deleteData"
              :nodeAdd="showAdd"
              :nodeEdit="showEdit"
              :nodeDel="showDel"
            >
            </operate-tree>
          </div>
        </Card>
      </i-Col>

      <i-Col :xs="24" :sm="14" :md="14" :lg="18">
        <Card :padding="0">
          <p slot="title">
            {{tableShow}}
            <a href="#" @click.prevent="chageTable">
              <Icon type="ios-loop-strong"></Icon>
              切换
            </a>
          </p>
          <div>
            <Card :bordered="false">
              <!--操作工具条-->
              <Row>
                <i-Col :xs="24" :sm="12" :md="14" :lg="16">
                  <Button type="primary" icon="edit" :disabled="btnDisabled" v-if="showEdit" @click="editData">修改</Button>
                  <Button type="error" icon="android-delete" :disabled="btnDisabled" v-if="showDel" @click="deleteData">删除</Button>
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
    <Modal :mask-closable="false" v-model="formVisible" :title="formTitle">
      <Form ref="formModel" :model="formModel" :rules="formValidate" :label-width="90">
        <FormItem label="上级资源：" prop="parentName">
          <i-Input v-model="formModel.parentName" readonly></i-Input>
          <i-Input v-model="formModel.parentId" v-show="false"></i-Input>
        </FormItem>
        <FormItem label="资源类型：" prop="type">
          <dict-select type="radio" code="RESOURCE_TYPE" v-bind:model.sync="formModel.type"></dict-select>
        </FormItem>
        <FormItem label="资源名称：" prop="resName">
          <Input v-model="formModel.resName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="资源编码：" prop="resCode">
          <i-Input v-model="formModel.resCode" placeholder="请输入"></i-Input>
        </FormItem>
        <FormItem label="资源图标：" prop="icon">
          <icon-pane v-bind:icon.sync="formModel.icon"></icon-pane>
        </FormItem>
        <FormItem label="排序号：" prop="seq">
          <InputNumber :max="100" :min="1" v-model="formModel.seq"></InputNumber>
        </FormItem>
        <FormItem label="状态：" prop="state">
          <i-switch v-model="formModel.state" size="large" :true-value="0" :false-value="1">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancal">取 消</Button>
        <Button type="primary" @click="doOperate">确 定</Button>
      </div>
    </Modal>

    <!-- 权限表单 -->
    <Modal :mask-closable="false" v-model="permVisible" :title="formTitle">
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
        <Button @click="cancal">取 消</Button>
        <Button type="primary" @click="doOperate">确 定</Button>
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
  import ResourceApi from '@/api/system/resource-api'
  import PermissionApi from '@/api/system/permission-api'
  import PermCheck from '@/libs/perm-check'

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
      // 表单标题
      formTitle () {
        switch (this.operteType) {
          case 10:
            return '添加资源'
          case 11:
            return '修改资源'
          case 12:
            return '删除资源'
          case 20:
            return '添加权限'
          case 21:
            return '修改权限'
          case 22:
            return '删除权限'
        }
      },
      // 操作按钮disabled
      btnDisabled () {
        return this.currCol == null
      },
      // 显示添加按钮
      showAdd () {
        return this.tableType === 0 ? PermCheck.resSave() : PermCheck.permSave()
      },
      // 显示编辑按钮
      showEdit () {
        return this.tableType === 0 ? PermCheck.resUpdate() : PermCheck.permUpdate()
      },
      // 显示删除按钮
      showDel () {
        return this.tableType === 0 ? PermCheck.resDelete() : PermCheck.permDelete()
      }
    },
    data () {
      return {
        // 切换操作不同表格 0：资源管理 1：权限管理
        tableType: 0,
        // 表单操作类型
        operteType: 0,
        // 操作树数据
        operateTreeData: [],
        // 默认展开节点
        operateExpandedKeys: [1],
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
        formModel: {
          parentId: null,
          parentName: null,
          type: null,
          resName: null,
          resCode: null,
          icon: null,
          seq: null,
          state: 0
        },
        // 表单添加初始化
        formAdd: {
          parentId: 0,
          parentName: '',
          type: 0,
          resName: '',
          resCode: '',
          icon: '',
          seq: 0,
          state: 0
        },
        // 表单验证
        formValidate: {
          parentName: [
            {required: true, message: '父资源不能为空', trigger: 'blur'}
          ],
          resName: [
            {required: true, message: '资源名称不能为空', trigger: 'blur'}
          ],
          resCode: [
            {required: true, message: '资源编码不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选项类型'}
          ],
          seq: [
            {required: true, message: '请选择排序号'}
          ],
          state: [
            {required: true, message: '请选择状态'}
          ]
        },
        // 权限表单标识
        permVisible: false,
        // 权限表单模型
        sysPermission: {
          resId: null,
          resName: null,
          permName: null,
          permCode: null,
          state: 0
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
            {required: true, message: '不能为空', trigger: 'blur'}
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
        ResourceApi.reqResourceOperateTree().then((data) => {
          let {code, result} = data
          if (code === 0) {
            this.operateTreeData = result.tree
          }
        })
      },
      loadListPage () {
        this.listLoading = true
        let method = 'get'
        let params = {...this.pageParam, ...this.pageQuery}
        if (this.tableType === 0) {
          if (this.pageParam.sidx === null) {
            this.pageParam.sidx = 'parentId, seq'
            this.pageParam.sort = 'asc'
          }
          // 加载资源表格
          ResourceApi.reqResourceListPage(method, params).then(data => {
            this.processListData(data)
          })
        } else {
          // 加载权限表格
          PermissionApi.reqPermissionListPage(method, params).then(data => {
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
        this.editData()
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
        // 被拖拽节点数据
        let currData = node.data
        // 进入节点数据
        let innerData = innerNode.data
        ResourceApi.reqResourceDrop(location, currData.resId, innerData.resId).then(data => {
          let {code, msg} = data
          this.operateExpandedKeys = [currData.resId]
          this.loadTreeData()
          if (code === 0) {
            this.$Message.success('修改成功')
            this.loadListPage()
          } else {
            this.$Message.error(msg)
          }
        })
      },
      // 树节点点击
      nodeClick (data, node, ref) {
        this.pageQuery.queryTree = data.resId === 1 ? null : data.resId
        this.loadListPage()
      },
      // 取消操作
      cancal () {
        if (this.operteType === 10 || this.operteType === 11) {
          this.resetForm('formModel')
          this.formVisible = false
        } else if (this.operteType === 20 || this.operteType === 21) {
          this.resetForm('sysPermission')
          this.permVisible = false
        }
      },
      // 根节点添加
      addRoot (data) {
        this.operteType = 10
        this.formVisible = true
        this.formModel = JSON.parse(JSON.stringify(this.formAdd))
        this.formModel.seq = this.operateTreeData.length + 1
        this.formModel.parentId = data.resId
        this.formModel.parentName = data.resName
      },
      // 根节点点击
      loadRoot () {
        this.pageQuery.queryTree = null
        this.loadListPage()
      },
      // 添加
      addData (data, node) {
        if (this.tableType === 0) {
          this.operteType = 10
          this.formVisible = true
          this.formModel = JSON.parse(JSON.stringify(this.formAdd))

          let children = data.children
          if (children.length > 0) {
            this.formModel.seq = children.length + 1
          } else {
            this.formModel.seq = 1
          }
          this.formModel.parentId = data.resId
          this.formModel.parentName = data.resName
          this.formModel.type = data.type
          // this.formModel.icon = data.icon
          this.formModel.state = data.state
        } else {
          this.operteType = 20
          this.permVisible = true
          this.sysPermission = JSON.parse(JSON.stringify(this.addPermission))
          this.sysPermission.resId = data.resId
          this.sysPermission.resName = data.resName
        }
      },
      // 树节点编辑
      treeEdit (data, node) {
        this.operteType = 11
        let resId = data.resId
        ResourceApi.reqResourceInfo(resId).then((resData) => {
          let {code, msg, result} = resData
          if (code === 0) {
            this.formVisible = true
            this.formModel = result
            let node = this.$refs.operateTree.getNode(result.parentId)
            if (node) {
              this.formModel.parentName = node.data.resName
            }
          } else {
            this.$Message.info(msg)
          }
        })
      },
      // 编辑
      editData () {
        if (this.tableType === 0 && this.currCol.resId) {
          this.operteType = 11
          let resId = this.currCol.resId
          ResourceApi.reqResourceInfo(resId).then((resData) => {
            let {code, msg, result} = resData
            if (code === 0) {
              this.formVisible = true
              this.formModel = result
              let node = this.$refs.operateTree.getNode(result.parentId)
              if (node) {
                this.formModel.parentName = node.data.resName
              }
            } else {
              this.$Message.info(msg)
            }
          })
        } else if (this.tableType === 1 && this.currCol.permId) {
          this.operteType = 21
          let permId = this.currCol.permId
          PermissionApi.reqPermissionInfo(permId).then((resData) => {
            let {code, msg, result} = resData
            if (code === 0) {
              this.permVisible = true
              this.sysPermission = result
              let node = this.$refs.operateTree.getNode(result.resId)
              if (node) {
                this.sysPermission.resName = node.data.resName
              }
            } else {
              this.$Message.info(msg)
            }
          })
        }
      },
      // 执行删除
      deleteData (data, node) {
        if (data.resId || (this.tableType === 0 && this.currCol.resId)) {
          this.operteType = 12
          this.doDelete(data.resId ? data : this.currCol)
        } else if (this.tableType === 1 && this.currCol.permId) {
          this.operteType = 22
          this.doDelete(this.currCol)
        }
      },
      doDelete (data) {
        switch (this.operteType) {
          // 删除资源
          case 12:
            this.$Modal.confirm({
              title: '提示',
              content: '<p>此操作将删除资源 <span style="color: red;">' + data.resName + '</span>, 是否继续?</p>',
              onOk: () => {
                ResourceApi.reqResourceDelete(data.resId).then(resData => {
                  let {code, msg} = resData
                  if (code === 0) {
                    this.$Message.success('删除成功！')
                    this.operateExpandedKeys = [data.parentId]
                    // this.pageQuery.queryTree = this.currCol.parentId
                    this.loadListPage()
                    this.loadTreeData()
                  } else {
                    this.$Message.warning(msg)
                  }
                })
              }
            })
            break
          // 删除权限
          case 22:
            this.$Modal.confirm({
              title: '提示',
              content: '<p>此操作将删除权限 <span style="color: red;">' + data.permName + '</span>, 是否继续?</p>',
              onOk: () => {
                PermissionApi.reqPermissionDelete(data.permId).then(resData => {
                  let {code, msg} = resData
                  if (code === 0) {
                    this.$Message.success('删除成功！')
                    this.loadListPage()
                  } else {
                    this.$Message.warning(msg)
                  }
                })
              }
            })
            break
        }
      },
      // 执行操作
      doOperate () {
        switch (this.operteType) {
          // 添加资源
          case 10:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                ResourceApi.reqResourceSave(this.formModel).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('添加成功')
                    this.operateExpandedKeys = [this.formModel.parentId]
                    this.pageQuery.queryTree = this.formModel.parentId
                    this.loadListPage()
                    this.loadTreeData()
                    this.formVisible = false
                  } else {
                    this.$Message.error(msg)
                  }
                })
              }
            })
            break
          // 修改资源
          case 11:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                ResourceApi.reqResourceUpdate(this.formModel, this.formModel.resId).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('修改成功')
                    this.operateExpandedKeys = [this.formModel.resId]
                    this.loadListPage()
                    this.loadTreeData()
                    this.formVisible = false
                  } else {
                    this.$Message.error(msg)
                  }
                })
              }
            })
            break
          // 添加权限
          case 20:
            this.$refs['sysPermission'].validate((valid) => {
              if (valid) {
                PermissionApi.reqPermissionSave(this.sysPermission).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('添加成功')
                    this.pageQuery.queryTree = this.sysPermission.resId
                    this.loadListPage()
                    this.permVisible = false
                  } else {
                    this.$Message.error(msg)
                  }
                })
              }
            })
            break
          // 修改权限
          case 21 :
            this.$refs['sysPermission'].validate((valid) => {
              if (valid) {
                PermissionApi.reqPermissionUpdate(this.sysPermission, this.sysPermission.permId).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('修改成功')
                    this.loadListPage()
                    this.permVisible = false
                  } else {
                    this.$Message.error(msg)
                  }
                })
              }
            })
            break
        }
      }
    }
  }
</script>
