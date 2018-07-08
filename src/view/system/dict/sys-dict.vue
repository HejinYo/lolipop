<template>
  <div>
    <Row :gutter="5">
      <i-Col :xs="24" :sm="10" :md="10" :lg="6">
        <Card>
          <p slot="title">字典目录</p>
          <div>
            <operate-tree
              ref="operateTree"
              :data="operateTreeData"
              value="id"
              label="name"
              :default-expand-all="true"
              :accordion="false"
              :nodeEdit="PermCheck.dictUpdate()"
              :nodeDel="PermCheck.dictDelete()"
              @root-add="addRoot"
              @root-load="loadRoot"
              @node-click="nodeClick"
              @node-edit="treeEdit"
              @node-del="deleteData"
              :showLabel="false">
              <span slot-scope="{ node, data }">
                <span>{{data.name}}</span>
                <Tag size="small" color="green" style="margin-left: 10px">{{data.code}}</Tag>
              </span>
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
                  <Button type="primary" icon="edit" :disabled="btnDisabled" v-if="PermCheck.dictUpdate()" @click="editData">修改</Button>
                  <Button type="error" icon="android-delete" :disabled="btnDisabled" v-if="PermCheck.dictDelete()" @click="deleteData">删除</Button>
                </i-Col>

                <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                  <i-Input v-model="pageQuery.queryValue" on-enter="search" placeholder="查询..." :maxlength="32">
                    <Select v-model="pageQuery.queryKey" @on-change="search" slot="prepend" style="width: 80px">
                      <Option value="dictName">字典名称</Option>
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
                <!-- 字典表格 -->
                <el-table stripe border highlight-current-row size="mini" element-loading-text="拼命加载中"
                          :data="listData" v-loading="listLoading" :height="clientHeight-303"
                          @row-click="rowClick" @row-dblclick="rowDbClick" @sort-change="sortChange">
                  <el-table-column prop="id" label="编号" sortable="custom" align="center" width="70"></el-table-column>
                  <el-table-column prop="code" label="字典编码" sortable="custom" align="center" min-width="150"></el-table-column>
                  <el-table-column prop="value" label="字典值" sortable="custom" align="center" min-width="150"></el-table-column>
                  <el-table-column prop="label" label="字典显示" sortable="custom" align="center" min-width="150"></el-table-column>
                  <el-table-column prop="description" label="描述" sortable="custom" align="center" min-width="150"></el-table-column>
                  <el-table-column prop="seq" sortable="custom" label="序号" align="center" width="70"></el-table-column>
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
      </i-Col>
    </Row>

    <!-- 字典表单 -->
    <!--<Modal :mask-closable="false" v-model="formVisible" :title="fromTitle">
      <Form ref="formModel" :model="formModel" :rules="formValidate" :label-width="90">
        <FormItem label="上级字典：" prop="parentName">
          <i-Input v-model="formModel.parentName" readonly></i-Input>
          <i-Input v-model="formModel.parentId" v-show="false"></i-Input>
        </FormItem>
        <FormItem label="字典名称：" prop="dictName">
          <Input v-model="formModel.dictName" placeholder="请输入"></Input>
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
      </Form>
      <div slot="footer">
        <Button @click="cancal">取 消</Button>
        <Button type="primary" @click="doOperate">确 定</Button>
      </div>
    </Modal>-->
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import OperateTree from '@/components/operate-tree'
  import DictApi from '@/api/system/dict-api'

  export default {
    name: 'sys-dict',
    components: {
      OperateTree
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
            return '添加字典'
          case 11:
            return '修改字典'
          case 12:
            return '删除字典'
        }
      }
    },
    data () {
      return {
        // 表单操作类型
        operteType: 0,
        // 操作树数据
        operateTreeData: [],
        // 默认展开节点
        operateExpandedKeys: [1],
        // 表格标题
        tableShow: '字典属性',
        // 表格加载
        listLoading: false,
        // 表格数据
        listData: [],
        // 当前选择行
        currCol: null,
        // 查询参数
        pageQuery: {
          queryTree: null,
          queryKey: 'dictName',
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
          dictName: null,
          description: null,
          seq: null,
          state: 0
        },
        // 表单添加初始化
        formAdd: {
          parentId: 0,
          parentName: '',
          dictName: '',
          description: '',
          seq: 0,
          state: 0
        },
        // 表单验证
        formValidate: {
          parentName: [
            {required: true, message: '父字典不能为空', trigger: 'blur'}
          ],
          dictName: [
            {required: true, message: '字典名称不能为空', trigger: 'blur'}
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
        this.loadTreeData()
        this.loadListPage()
      })
    },
    methods: {
      loadTreeData () {
        DictApi.reqDictOperateTree().then((data) => {
          let {code, result} = data
          if (code === 0) {
            this.operateTreeData = result
          }
        })
      },
      loadListPage () {
        this.listLoading = true
        let method = 'get'
        let params = {...this.pageParam, ...this.pageQuery}
        if (this.pageParam.sidx === null) {
          this.pageParam.sidx = 'id'
          this.pageParam.sort = 'asc'
        }
        // 加载字典表格
        DictApi.reqOptionListPage(method, params).then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.currCol = null
            this.listData = result.list
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
        DictApi.reqDictDrop(location, currData.id, innerData.id).then(data => {
          let {code, msg} = data
          this.operateExpandedKeys = [currData.id]
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
        this.pageQuery.queryTree = data.code
        this.loadListPage()
      },
      // 根节点添加
      addRoot (data) {
        this.operteType = 10
        this.formVisible = true
        this.formModel = JSON.parse(JSON.stringify(this.formAdd))
        this.formModel.seq = this.operateTreeData.length + 1
        this.formModel.parentId = data.id
        this.formModel.parentName = data.dictName
      },
      // 根节点点击
      loadRoot () {
        this.pageQuery.queryTree = null
        this.loadListPage()
      },
      // 取消操作
      cancal () {
        this.resetForm('formModel')
        this.formVisible = false
      },
      // 添加
      addData (data, node) {
        this.operteType = 10
        this.formVisible = true
        this.formModel = JSON.parse(JSON.stringify(this.formAdd))
        let children = data.children
        if (children.length > 0) {
          this.formModel.seq = children.length + 1
        } else {
          this.formModel.seq = 1
        }
        this.formModel.parentId = data.id
        this.formModel.parentName = data.dictName
        this.formModel.state = data.state
      },
      // 树节点编辑
      treeEdit (data, node) {
        this.operteType = 11
        let id = data.id
        DictApi.reqDictInfo(id).then((dictData) => {
          let {code, msg, result} = dictData
          if (code === 0) {
            this.formVisible = true
            this.formModel = result
            let node = this.$refs.operateTree.getNode(result.parentId)
            if (node) {
              this.formModel.parentName = node.data.dictName
            }
          } else {
            this.$Message.info(msg)
          }
        })
      },
      // 编辑
      editData () {
        if (this.currCol.id) {
          this.operteType = 11
          let id = this.currCol.id
          DictApi.reqDictInfo(id).then((dictData) => {
            let {code, msg, result} = dictData
            if (code === 0) {
              this.formVisible = true
              this.formModel = result
              let node = this.$refs.operateTree.getNode(result.parentId)
              if (node) {
                this.formModel.parentName = node.data.dictName
              }
            } else {
              this.$Message.info(msg)
            }
          })
        }
      },
      // 执行删除
      deleteData (data, node) {
        this.doDelete(data.id ? data : this.currCol)
      },
      doDelete (data) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>此操作将删除字典 <span style="color: red;">' + data.dictName + '</span>, 是否继续?</p>',
          onOk: () => {
            DictApi.reqDictDelete(data.id).then(dictData => {
              let {code, msg} = dictData
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
      },
      // 执行操作
      doOperate () {
        switch (this.operteType) {
          // 添加字典
          case 10:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                DictApi.reqDictSave(this.formModel).then(data => {
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
          // 修改字典
          case 11:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                DictApi.reqDictUpdate(this.formModel, this.formModel.id).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('修改成功')
                    this.operateExpandedKeys = [this.formModel.id]
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
