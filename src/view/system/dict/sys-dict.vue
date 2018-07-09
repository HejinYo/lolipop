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
              :rootAddShow="true"
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
                  <Button type="primary" icon="plus" :disabled="addBtnDisabled" v-if="PermCheck.dictOptionSave()" @click="addOptionData">添加</Button>
                  <Button type="primary" icon="edit" :disabled="btnDisabled" v-if="PermCheck.dictOptionUpdate()" @click="editOptionData">修改</Button>
                  <Button type="error" icon="android-delete" :disabled="btnDisabled" v-if="PermCheck.dictOptionDelete()" @click="deleteData">删除</Button>
                </i-Col>

                <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                  <i-Input v-model="pageQuery.queryValue" on-enter="search" placeholder="查询..." :maxlength="32">
                    <Select v-model="pageQuery.queryKey" @on-change="search" slot="prepend" style="width: 80px">
                      <Option value="label">显示值</Option>
                      <Option value="value">字典值</Option>
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
    <!-- 字典目录单 -->
    <Modal :mask-closable="false" v-model="formVisible" :title="formTitle">
      <Form ref="formModel" :model="formModel" :rules="formValidate" :label-width="90">
        <FormItem label="字典名称：" prop="name">
          <i-Input v-model="formModel.name"></i-Input>
        </FormItem>
        <FormItem label="字典编码：" prop="code">
          <i-Input v-model="formModel.code"></i-Input>
        </FormItem>
        <FormItem label="数据类型：" prop="type">
          <dict-select type="radio" code="DATA_TYPE" v-bind:model.sync="formModel.type"></dict-select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancal">取 消</Button>
        <Button type="primary" @click="doOperate">确 定</Button>
      </div>
    </Modal>

    <!-- 字典表单 -->
    <Modal :mask-closable="false" v-model="optionVisible" :title="formTitle">
      <Form ref="optionModel" :model="optionModel" :rules="optionValidate" :label-width="90">
        <FormItem label="字典编码：" prop="code">
          <i-Input v-model="optionModel.code" readonly></i-Input>
        </FormItem>
        <FormItem label="显示值：" prop="label">
          <i-Input v-model="optionModel.label"></i-Input>
        </FormItem>
        <FormItem label="字典值：" prop="value">
          <i-Input v-model="optionModel.value"></i-Input>
        </FormItem>
        <FormItem label="排序号：" prop="seq">
          <InputNumber :max="100" :min="1" v-model="optionModel.seq"></InputNumber>
        </FormItem>
        <FormItem label="说明：" prop="description">
          <i-Input v-model="optionModel.description"></i-Input>
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
  import DictSelect from '@/components/dict-select'
  import DictApi from '@/api/system/dict-api'

  export default {
    name: 'sys-dict',
    components: {
      DictSelect,
      OperateTree
    },
    computed: {
      ...mapGetters([
        'clientHeight'
      ]),
      addBtnDisabled () {
        return this.currData === null
      },
      // 操作按钮disabled
      btnDisabled () {
        return this.currCol === null
      },
      // 表单标题
      formTitle () {
        switch (this.operteType) {
          case 10:
            return '添加字典目录'
          case 11:
            return '修改字典目录'
          case 12:
            return '删除字典目录'
          case 20:
            return '添加字典属性'
          case 21:
            return '修改字典属性'
          case 22:
            return '删除字典属性'
        }
      }
    },
    data () {
      return {
        // 表单操作类型
        operteType: 0,
        // 操作树数据
        operateTreeData: [],
        // 当前选择节点
        currData: null,
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
          queryKey: 'label',
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
          name: null,
          code: null,
          type: null
        },
        // 表单添加初始化
        formAdd: {
          name: '',
          code: '',
          type: 0
        },
        // 表单验证
        formValidate: {
          name: [
            {required: true, message: '字典名称不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '字典编码不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择数据类型'}
          ]
        },
        // 字典属性显示表单标识
        optionVisible: false,
        // 字典属性表单模型
        optionModel: {
          code: null,
          label: null,
          value: null,
          description: null,
          seq: null
        },
        // 字典属性表单添加初始化
        optionAdd: {
          code: null,
          label: null,
          value: null,
          description: null,
          seq: 0
        },
        // 字典属性表单验证
        optionValidate: {
          label: [
            {required: true, message: '显示值不能为空', trigger: 'blur'}
          ],
          value: [
            {required: true, message: '属性值不能为空', trigger: 'blur'}
          ],
          seq: [
            {required: true, message: '请选择排序号'}
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
          this.pageParam.sidx = 'code,seq'
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
        this.editOptionData()
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
      // 树节点点击
      nodeClick (data, node, ref) {
        this.currData = data
        this.pageQuery.queryTree = data.code
        this.loadListPage()
      },
      // 根节点添加
      addRoot (data) {
        this.operteType = 10
        this.formVisible = true
        this.formModel = JSON.parse(JSON.stringify(this.formAdd))
        this.formModel.seq = this.operateTreeData.length + 1
      },
      // 根节点点击
      loadRoot () {
        this.currData = null
        this.pageQuery.queryTree = null
        this.loadListPage()
      },
      // 取消操作
      cancal () {
        if (this.operteType === 10 || this.operteType === 11) {
          this.resetForm('formModel')
          this.formVisible = false
        } else {
          this.resetForm('optionModel')
          this.optionVisible = false
        }
      },
      // 树节点编辑
      treeEdit (data, node) {
        this.operteType = 11
        let id = data.id
        DictApi.reqDictInfo(id).then((name) => {
          let {code, msg, result} = name
          if (code === 0) {
            this.formVisible = true
            this.formModel = result
          } else {
            this.$Message.info(msg)
          }
        })
      },
      // 添加
      addOptionData () {
        this.operteType = 20
        this.optionVisible = true
        this.optionModel = JSON.parse(JSON.stringify(this.optionAdd))
        this.optionModel.code = this.currData.code
      },
      // 编辑
      editOptionData () {
        if (this.currCol.id) {
          this.operteType = 21
          let id = this.currCol.id
          DictApi.reqOptionInfo(id).then((name) => {
            let {code, msg, result} = name
            if (code === 0) {
              this.optionVisible = true
              this.optionModel = result
            } else {
              this.$Message.error(msg)
            }
          })
        }
      },
      // 执行删除
      deleteData (data, node) {
        if (data.id) {
          this.operteType = 12
          this.doDelete(data)
        } else if (this.currCol.id) {
          this.operteType = 22
          this.doDelete(this.currCol)
        }
      },
      doDelete (data) {
        switch (this.operteType) {
          // 删除字典目录
          case 12:
            this.$Modal.confirm({
              title: '提示',
              content: '<p>此操作将删除字典 <span style="color: red;">' + data.name + '</span>, 是否继续?</p>',
              onOk: () => {
                DictApi.reqDictDelete(data.id).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('删除成功！')
                    this.pageQuery.queryTree = null
                    this.loadListPage()
                    this.loadTreeData()
                  } else {
                    this.$Message.warning(msg)
                  }
                })
              }
            })
            break
          // 删除字典属性
          case 22:
            this.$Modal.confirm({
              title: '提示',
              content: '<p>此操作将删除属性 <span style="color: red;">' + data.label + '</span>, 是否继续?</p>',
              onOk: () => {
                DictApi.reqOptionDelete(data.id).then(data => {
                  let {code, msg} = data
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
            break
        }
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
                    this.formVisible = false
                    this.$Message.success('修改成功')
                    this.loadListPage()
                    this.loadTreeData()
                  } else {
                    this.$Message.error(msg)
                  }
                })
              }
            })
            break
          // 添加字典属性
          case 20:
            this.$refs['optionModel'].validate((valid) => {
              if (valid) {
                DictApi.reqOptionSave(this.optionModel).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('添加成功')
                    this.loadListPage()
                    this.loadTreeData()
                    this.optionVisible = false
                  } else {
                    this.$Message.error(msg)
                  }
                })
              }
            })
            break
          // 修改属性
          case 21:
            this.$refs['optionModel'].validate((valid) => {
              if (valid) {
                DictApi.reqOptionUpdate(this.optionModel, this.optionModel.id).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('修改成功')
                    this.loadListPage()
                    this.loadTreeData()
                    this.optionVisible = false
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
