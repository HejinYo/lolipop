<template>
  <div>
    <Row :gutter="5">
      <Card :padding="0">
        <p slot="title">
          {{tableShow}}
        </p>
        <div>
          <Card :bordered="false">
            <!--操作工具条-->
            <Row>
              <i-Col :xs="24" :sm="12" :md="14" :lg="16">
                <Button type="primary" icon="plus" v-if="PermCheck.roleSave()" @click="addData">添加</Button>
                <Button type="primary" icon="edit" :disabled="btnDisabled" v-if="PermCheck.roleUpdate()" @click="editData">修改</Button>
                <Button type="error" icon="android-delete" :disabled="btnDisabled" v-if="PermCheck.roleDelete()" @click="deleteData">删除</Button>
              </i-Col>

              <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                <i-Input v-model="pageQuery.queryValue" on-enter="search" placeholder="查询..." :maxlength="32">
                  <Select v-model="pageQuery.queryKey" @on-change="search" slot="prepend" style="width: 80px">
                    <Option value="roleName">角色名称</Option>
                    <Option value="roleCode">角色编码</Option>
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
              <!-- 角色表格 -->
              <el-table stripe border highlight-current-row size="mini" element-loading-text="拼命加载中"
                        :data="listData" v-loading="listLoading" :height="clientHeight-303"
                        @row-click="rowClick" @row-dblclick="rowDbClick" @sort-change="sortChange">
                <el-table-column prop="roleId" label="编号" sortable="custom" align="center" width="70"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" sortable="custom" align="center" width="150"></el-table-column>
                <el-table-column prop="roleCode" label="角色编码" sortable="custom" align="center" width="150"></el-table-column>
                <el-table-column prop="description" label="描述" sortable="custom" align="center" min-width="150"></el-table-column>
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
    </Row>

    <!-- 角色表单 -->
    <Modal :mask-closable="false" v-model="formVisible" :title="fromTitle">
      <Form ref="formModel" :model="formModel" :rules="formValidate" :label-width="90">
        <FormItem label="角色名称：" prop="roleName">
          <Input v-model="formModel.roleName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="角色编码：" prop="roleCode">
          <Input v-model="formModel.roleCode" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="描述：" prop="description">
          <i-Input v-model="formModel.description"></i-Input>
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
        <FormItem label="角色权限：">
          <div style="max-height: 300px;overflow-y:auto;padding-right: 30px;">
            <el-tree
              :data="authTree"
              show-checkbox
              node-key="id"
              ref="authTree"
              :props="{children: 'children',abel: 'label'}"
              :default-expanded-keys="expandedKeys">
            </el-tree>
          </div>
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
  import DictShow from '@/components/dict-show'
  import DictSelect from '@/components/dict-select'
  import RoleApi from '@/api/system/role-api'
  import PermissionApi from '@/api/system/permission-api'

  export default {
    name: 'sys-role',
    components: {
      OperateTree,
      DictShow,
      DictSelect
    },
    computed: {
      ...mapGetters([
        'clientHeight'
      ]),
      // 操作按钮disabled
      btnDisabled () {
        return this.currCol == null
      },
      // 表单标题
      fromTitle () {
        switch (this.operteType) {
          case 10:
            return '添加角色'
          case 11:
            return '修改角色'
          case 12:
            return '删除角色'
        }
      }
    },
    data () {
      return {
        // 授权树数据
        authTree: [],
        // 展开节点
        expandedKeys: [],
        // 表单操作类型
        operteType: 0,
        // 表格标题
        tableShow: '角色管理',
        // 表格加载
        listLoading: false,
        // 表格数据
        listData: [],
        // 当前选择行
        currCol: null,
        // 查询参数
        pageQuery: {
          queryKey: 'roleName',
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
          roleName: null,
          roleCode: null,
          description: null,
          seq: null,
          state: 0,
          permIdList: []
        },
        // 表单添加初始化
        formAdd: {
          roleName: '',
          roleCode: '',
          description: '',
          seq: 0,
          state: 0,
          permIdList: []
        },
        // 表单验证
        formValidate: {
          roleName: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ],
          roleCode: [
            {required: true, message: '角色编码不能为空', trigger: 'blur'}
          ],
          seq: [
            {required: true, message: '请选择排序号'}
          ],
          state: [
            {required: true, message: '请选择状态'}
          ]
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        // 保证完全挂载
        this.loadListPage()
        this.loadAuthTree()
      })
    },
    methods: {
      loadAuthTree () {
        PermissionApi.reqPermissionAuthTree().then((data) => {
          let {code, result} = data
          if (code === 0) {
            this.authTree = result
          }
        })
      },
      loadListPage () {
        this.listLoading = true
        let method = 'get'
        let params = {...this.pageParam, ...this.pageQuery}
        if (this.pageParam.sidx === null) {
          this.pageParam.sidx = 'seq'
          this.pageParam.sort = 'asc'
        }
        // 加载角色表格
        RoleApi.reqRoleListPage(method, params).then(data => {
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
      // 取消操作
      cancal () {
        this.resetForm('formModel')
        this.formVisible = false
        this.$refs.authTree.setCheckedKeys([])
        this.expandedKeys = []
      },
      // 添加
      addData () {
        this.loadAuthTree()
        this.operteType = 10
        this.formVisible = true
        this.formModel = JSON.parse(JSON.stringify(this.formAdd))
        this.formModel.seq = this.pageParam.total + 1
      },
      // 编辑
      editData () {
        if (this.currCol.roleId) {
          this.operteType = 11
          let roleId = this.currCol.roleId
          RoleApi.reqRoleInfo(roleId).then((roleData) => {
            let {code, msg, result} = roleData
            if (code === 0) {
              this.formVisible = true
              this.formModel = result
              this.$refs.authTree.setCheckedKeys(result.permIdList)
              this.expandedKeys = result.permIdList
            } else {
              this.$Message.info(msg)
            }
          })
        }
      },
      // 执行删除
      deleteData () {
        let data = this.currCol
        this.$Modal.confirm({
          title: '提示',
          content: '<p>此操作将删除角色 <span style="color: red;">' + data.roleName + '</span>, 是否继续?</p>',
          onOk: () => {
            RoleApi.reqRoleDelete(data.roleId).then(roleData => {
              let {code, msg} = roleData
              if (code === 0) {
                this.$Message.success('删除成功！')
                this.loadListPage()
              } else {
                this.$Message.warning(msg)
              }
            })
          }
        })
      },
      // 执行操作
      doOperate () {
        switch (this.operteType) {
          // 添加角色
          case 10:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                this.formModel.permIdList = this.$refs.authTree.getCheckedKeys().filter(value => value > 0)
                RoleApi.reqRoleSave(this.formModel).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('添加成功')
                    this.loadListPage()
                    this.formVisible = false
                    this.$refs.authTree.setCheckedKeys([])
                    this.expandedKeys = []
                  } else {
                    this.$Message.error(msg)
                  }
                })
              }
            })
            break
          // 修改角色
          case 11:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                this.formModel.permIdList = this.$refs.authTree.getCheckedKeys().filter(value => value > 0)
                RoleApi.reqRoleUpdate(this.formModel, this.formModel.roleId).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('修改成功')
                    this.loadListPage()
                    this.formVisible = false
                    this.$refs.authTree.setCheckedKeys([])
                    this.expandedKeys = []
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
