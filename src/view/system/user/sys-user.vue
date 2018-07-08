<template>
  <div>
    <Row :gutter="5">
      <i-Col :xs="24" :sm="10" :md="10" :lg="6">
        <Card>
          <p slot="title">用户用户</p>
          <div>
            <operate-tree
              ref="operateTree"
              :data="deptSelect"
              value="deptId"
              label="deptName"
              icon="icon"
              :defaultExpandAll="true"
              :accordion="false"
              @node-click="nodeClick"
              @root-load="loadRoot">
            </operate-tree>
          </div>
        </Card>
      </i-Col>

      <i-Col :xs="24" :sm="14" :md="14" :lg="18">
        <Card :padding="0">
          <p slot="title">
            {{tableShow}}
          </p>
          <div>
            <Card :bordered="false">
              <!--操作工具条-->
              <Row>
                <i-Col :xs="24" :sm="12" :md="14" :lg="16">
                  <Button type="primary" icon="plus" v-if="PermCheck.userSave()" @click="addData">添加</Button>
                  <Button type="primary" icon="edit" :disabled="btnDisabled" v-if="PermCheck.userUpdate()" @click="editData">修改</Button>
                  <Button type="error" icon="android-delete" :disabled="btnDisabled" v-if="PermCheck.userDelete()" @click="deleteData">删除</Button>
                </i-Col>

                <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                  <i-Input v-model="pageQuery.queryValue" on-enter="search" placeholder="查询..." :maxlength="32">
                    <Select v-model="pageQuery.queryKey" @on-change="search" slot="prepend" style="width: 80px">
                      <Option value="userName">用户名称</Option>
                      <Option value="description">说明</Option>
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
                <!-- 用户表格 -->
                <el-table stripe border highlight-current-row size="mini" element-loading-text="拼命加载中"
                          :data="listData" v-loading="listLoading" :height="clientHeight-303"
                          @row-click="rowClick" @row-dblclick="rowDbClick" @sort-change="sortChange">
                  <el-table-column prop="userId" label="编号" sortable="custom" align="center" width="70"></el-table-column>
                  <el-table-column prop="userDeptList" label="部门" align="center" min-width="120">
                    <template slot-scope="scope">
                      <Button type="info" size="small" v-for="dept in scope.row.deptList" :key="dept.deptId">
                        {{dept.deptName}}
                      </Button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="roleList" label="角色" align="center" min-width="100">
                    <template slot-scope="scope">
                      <Button type="success" size="small" v-for="role in scope.row.roleList" :key="role.roleId">{{role.roleName}}</Button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="userName" label="用户名称" sortable="custom" align="center" min-width="100"></el-table-column>
                  <el-table-column prop="nickName" label="用户昵称" sortable="custom" align="center" min-width="100"></el-table-column>
                  <el-table-column prop="avatar" label="头像" sortable="custom" align="center" min-width="90" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <Avatar :src="scope.row.avatar" size="small" v-if="scope.row.avatar"/>
                    </template>
                  </el-table-column>
                  <el-table-column prop="email" label="邮箱" sortable="custom" align="center" min-width="150"></el-table-column>
                  <el-table-column prop="phone" label="手机" sortable="custom" align="center" min-width="100"></el-table-column>
                  <el-table-column prop="loginIp" label="登录IP" sortable="custom" align="center" width="120"></el-table-column>
                  <el-table-column prop="loginTime" label="登录时间" sortable="custom" align="center" width="150"></el-table-column>
                  <el-table-column prop="state" sortable="custom" label="状态" align="center" width="90">
                    <template slot-scope="scope">
                      <Tag :color="scope.row.state === 0 ? 'green': 'red' ">
                        {{scope.row.state === 0 ? '正常' : '禁用'}}
                      </Tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" sortable="custom" label="创建日期" align="center" width="150"></el-table-column>
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
      </i-Col>
    </Row>

    <!-- 用户表单 -->
    <Modal :mask-closable="false" v-model="formVisible" :title="fromTitle">
      <Form ref="formModel" :model="formModel" :rules="formValidate" :label-width="90">
        <FormItem label="用户名称：" prop="userName">
          <Input v-model="formModel.userName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="昵称：" prop="nickName">
          <i-Input v-model="formModel.nickName"></i-Input>
        </FormItem>
        <FormItem v-if="this.operteType === 10" label="登录密码：" prop="userPwd">
          <Input v-model="formModel.userPwd" type="password"></Input>
        </FormItem>
        <FormItem v-if="this.operteType === 11" label="修改密码：">
          <Input v-model="formModel.userPwd" placeholder="为空不修改密码"></Input>
        </FormItem>
        <FormItem label="邮箱：" prop="email">
          <i-Input v-model="formModel.email"></i-Input>
        </FormItem>
        <FormItem label="手机：" prop="phone">
          <i-Input v-model="formModel.phone"></i-Input>
        </FormItem>
        <FormItem label="头像：" prop="avatar">
          <i-Input v-model="formModel.avatar"></i-Input>
        </FormItem>
        <FormItem label="角色：" prop="roleIdList">
          <Select v-model="formModel.roleIdList" multiple>
            <Option v-for="item in roleDrop" :value="item.roleId" :label="item.roleName" :key="item.roleId"></Option>
          </Select>
        </FormItem>
        <FormItem label="部门：" prop="deptIdList">
          <div style="max-height: 300px;overflow-y:auto;padding-right: 30px;">
            <el-tree
              :data="deptSelect"
              show-checkbox
              node-key="deptId"
              ref="deptSelect"
              :props="{children: 'children',label: 'deptName'}"
              :default-expanded-keys="expandedKeys"
              check-strictly
              @check="deptSelectClick">
            </el-tree>
          </div>
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
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import OperateTree from '@/components/operate-tree'
  import DictShow from '@/components/dict-show'
  import DictSelect from '@/components/dict-select'
  import UserApi from '@/api/system/user-api'
  import DeptApi from '@/api/system/dept-api'
  import RoleApi from '@/api/system/role-api'
  import { validatePhone } from '@/libs/validate'

  export default {
    name: 'sys-user',
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
            return '添加用户'
          case 11:
            return '修改用户'
          case 12:
            return '删除用户'
        }
      }
    },
    data () {
      return {
        // 角色下拉数据
        roleDrop: [],
        // 表单操作类型
        operteType: 0,
        // 部门树数据
        deptSelect: [],
        // 默认展开节点
        expandedKeys: [],
        // 表格标题
        tableShow: '用户管理',
        // 表格加载
        listLoading: false,
        // 表格数据
        listData: [],
        // 当前选择行
        currCol: null,
        // 查询参数
        pageQuery: {
          queryTree: null,
          queryKey: 'userName',
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
          userId: null,
          userName: null,
          userPwd: null,
          nickName: null,
          email: null,
          phone: null,
          avatar: null,
          roleIdList: [],
          deptIdList: [],
          state: 0
        },
        // 表单添加初始化
        formAdd: {
          userId: null,
          userName: 'hejinyo',
          userPwd: '123456',
          nickName: 'hejinyo',
          email: '',
          phone: '15595303900',
          avatar: '',
          roleIdList: [],
          deptIdList: [],
          state: 0
        },
        // 表单验证
        formValidate: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 1, message: '至少 1 个字符', trigger: 'blur'}
          ],
          userPwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '至少 6 个字符', trigger: 'blur'}
          ],
          nickName: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {min: 1, message: '至少 1 个字符', trigger: 'blur'}
          ],
          deptIdList: [
            {required: true, type: 'array', message: '请选择部门', trigger: 'change'}
          ],
          roleIdList: [
            {required: true, type: 'array', message: '请选择角色', trigger: 'change'}
          ],
          phone: [
            {validator: validatePhone, trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        // 保证完全挂载
        this.loadTreeData()
        this.loadListPage()
        this.loadRoleDrop()
      })
    },
    methods: {
      // 加载部门选择树数据
      loadTreeData () {
        DeptApi.reqDeptSelect().then((data) => {
          let {code, result} = data
          if (code === 0) {
            this.deptSelect = result.tree
          }
        })
      },
      // 加载角色下拉列表数据
      loadRoleDrop () {
        RoleApi.reqRoleDrop().then((data) => {
          let {code, result} = data
          if (code === 0) {
            this.roleDrop = result
          }
        })
      },
      loadListPage () {
        this.listLoading = true
        let method = 'get'
        let params = {...this.pageParam, ...this.pageQuery}
        if (this.pageParam.sidx === null) {
          this.pageParam.sidx = 'userId'
          this.pageParam.sort = 'asc'
        }
        // 加载用户表格
        UserApi.reqUserListPage(method, params).then(data => {
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
      // 根节点点击
      loadRoot () {
        this.pageQuery.queryTree = null
        this.loadListPage()
      },
      // 树节点点击
      nodeClick (data, node, ref) {
        this.pageQuery.queryTree = data.deptId === 1 ? null : data.deptId
        this.loadListPage()
      },
      // 部门选择树点击
      deptSelectClick (data, node, ref) {
        console.log(this.$refs.deptSelect.getCheckedKeys())
        this.formModel.deptIdList = this.$refs.deptSelect.getCheckedKeys()
      },
      // 取消操作
      cancal () {
        this.resetForm('formModel')
        this.formVisible = false
      },
      // 添加
      addData () {
        this.operteType = 10
        this.formVisible = true
        this.formModel = JSON.parse(JSON.stringify(this.formAdd))
      },
      // 树节点编辑
      treeEdit (data, node) {
        this.operteType = 11
        let userId = data.userId
        UserApi.reqUserInfo(userId).then((userData) => {
          let {code, msg, result} = userData
          if (code === 0) {
            this.formVisible = true
            this.formModel = result
            let node = this.$refs.operateTree.getNode(result.parentId)
            if (node) {
              this.formModel.parentName = node.data.userName
            }
          } else {
            this.$Message.info(msg)
          }
        })
      },
      // 编辑
      editData () {
        if (this.currCol.userId) {
          this.operteType = 11
          let userId = this.currCol.userId
          UserApi.reqUserInfo(userId).then((userData) => {
            let {code, msg, result} = userData
            if (code === 0) {
              this.formVisible = true
              this.formModel = result
              this.$refs.deptSelect.setCheckedKeys(result.deptIdList)
              this.expandedKeys = result.deptIdList
            } else {
              this.$Message.info(msg)
            }
          })
        }
      },
      // 执行删除
      deleteData (data, node) {
        this.doDelete(data.userId ? data : this.currCol)
      },
      doDelete (data) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>此操作将删除用户 <span style="color: red;">' + data.userName + '</span>, 是否继续?</p>',
          onOk: () => {
            UserApi.reqUserDelete(data.userId).then(userData => {
              let {code, msg} = userData
              if (code === 0) {
                this.$Message.success('删除成功！')
                this.loadListPage()
                this.loadTreeData()
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
          // 添加用户
          case 10:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                UserApi.reqUserSave(this.formModel).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('添加成功')
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
          // 修改用户
          case 11:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                UserApi.reqUserUpdate(this.formModel, this.formModel.userId).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('修改成功')
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
        }
      }

    }
  }
</script>
