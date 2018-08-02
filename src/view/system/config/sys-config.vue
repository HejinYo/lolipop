<template>
  <div>
    <Row :gutter="5">
      <Card :padding="0">
        <p slot="title">
          {{tableShow}}
        </p>
        <div>
          <Card :bordered="false">
            <Row>
              <!--操作工具条-->
              <i-Col :xs="24" :sm="12" :md="14" :lg="16">
                <Button type="primary" icon="md-add-circle" @click="addData" v-if="PermCheck.dictSave()">添加</Button>
                <Button type="primary" icon="md-create" :disabled="btnDisabled" @click="editData" v-if="PermCheck.configUpdate()">修改</Button>
                <Button type="error" icon="md-trash" :disabled="btnDisabled" @click="deleteData" v-if="PermCheck.configDelete()">删除</Button>
              </i-Col>
              <!-- 简单查询 -->
              <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                <i-Input v-model="pageQuery.queryValue" :disabled="advancedSearch" on-enter="search" placeholder="查询..." :maxlength="32">
                  <Select v-model="pageQuery.queryKey" :disabled="advancedSearch" @on-change="search" slot="prepend" style="width: 80px">
                    <Option value="name">配置名称</Option>
                    <Option value="code">配置编码</Option>
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
              <el-table stripe border highlight-current-row size="mini" element-loading-text="拼命加载中"
                        :data="listData" v-loading="listLoading" :height="clientHeight-303"
                        @row-click="rowClick" @row-dblclick="rowDbClick" @sort-change="sortChange">
                <el-table-column prop="configId" label="配置ID" sortable="custom" align="center" width="90"></el-table-column>
                <el-table-column prop="name" label="配置名称" sortable="custom" min-width="120"></el-table-column>
                <el-table-column prop="code" label="配置编码" sortable="custom" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="label" label="配置选项" sortable="custom" align="center" min-width="150">
                  <template slot-scope="scope">
                    <Select transfer v-model="scope.row.optionId" size="small" @on-change="selectChange" label-in-value>
                      <Option v-for="item in scope.row.optionList" :value="item.optionId" :label="item.label" :key="item.optionId"></Option>
                    </Select>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="配置值" sortable="custom" align="center" min-width="200">
                  <template slot-scope="scope">
                    <json-view v-if="scope.row.type === 4" :value="scope.row.value" placement="left-end">
                      <span slot="button">
                        {{scope.row.value}}
                      </span>
                    </json-view>
                    <span v-else>{{scope.row.value}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="数据类型" sortable="custom" align="center" width="100">
                  <template slot-scope="scope">
                    <dict-show code="DATA_TYPE" :dictValue="scope.row.type"></dict-show>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" sortable="custom" align="center" width="90">
                  <template slot-scope="scope">
                    <Tag :color="scope.row.state === 0 ? 'success': 'warning' ">
                      {{scope.row.state === 0 ? '正常' : '禁用'}}
                    </Tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建日期" sortable="custom" align="center" width="160"></el-table-column>
                <el-table-column label="操作" v-if="PermCheck.configUpdate()" align="center" width="60">
                  <template slot-scope="scope">
                    <Button size="small" type="info" @click="changeOption(scope.row)">选项</Button>
                  </template>
                </el-table-column>
              </el-table>
              <br/>
              <Page show-elevator show-total show-sizer size="small" placement="top"
                    :total="pageParam.total"
                    :current="pageParam.pageNum===0?1:pageParam.pageNum"
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
    <!-- 配置表单 -->
    <Modal :mask-closable="false" v-model="formVisible" :title="formTitle">
      <Form ref="formModel" :model="formModel" :rules="formValidate" :label-width="100" label-position="right">
        <FormItem label="配置名称：" prop="name">
          <Input v-model="formModel.name"></Input>
        </FormItem>
        <FormItem label="配置编码：" prop="name">
          <Input v-model="formModel.code"></Input>
        </FormItem>
        <FormItem label="数据类型：" prop="type">
          <dict-select type="radio" code="DATA_TYPE" v-bind:model.sync="formModel.type"></dict-select>
        </FormItem>
        <FormItem label="状态:" prop="status">
          <i-switch v-model="formModel.status" size="large" :true-value="0" :false-value="1">
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

    <!-- 配置属性面板 -->
    <Modal :mask-closable="false" v-model="optionVisible" width="800">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{optionTitle}}</span>
      </p>
      <div>
        <!-- 表格 -->
        <el-table :data="optionList" stripe border highlight-current-row element-loading-text="拼命加载中" size="mini">
          <el-table-column prop="optionId" label="ID" align="center" width="50"></el-table-column>
          <el-table-column prop="value" label="配置值" align="center" min-width="150">
            <template slot-scope="scope">
              <json-view :value="scope.row.value" placement="right">
                <span slot="button">
                  <i-Input v-model="scope.row.value" type="textarea" :rows="1"></i-Input>
                </span>
              </json-view>
            </template>
          </el-table-column>
          <el-table-column prop="label" label="显示值" align="center" min-width="150">
            <template slot-scope="scope">
              <i-Input v-model="scope.row.label"></i-Input>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明" align="center" min-width="120">
            <template slot-scope="scope">
              <i-Input v-model="scope.row.description"></i-Input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  width="120">
            <template slot-scope="scope">
              <Button size="small" type="info" @click="operOption(scope.$index, scope.row)">
                {{ scope.row.optionId?'更新':'保存'}}
              </Button>
              <Button size="small" type="error" @click="delOption(scope.$index, scope.row)">
                删除
              </Button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <Button type="success" @click="addOption" v-if="!optionAddFlag">添加</Button>
        <Button @click="optionVisible = !optionVisible">确定</Button>
      </div>
    </Modal>

  </div>

</template>
<script>
  import { mapGetters } from 'vuex'
  import DictShow from '@/components/dict-show'
  import DictSelect from '@/components/dict-select'
  import JsonView from '@/components/json-view'
  import ConfigApi from '@/api/system/config-api'

  export default {
    name: 'config',
    components: {
      DictShow,
      DictSelect,
      JsonView
    },
    computed: {
      ...mapGetters([
        'clientHeight'
      ]),
      btnDisabled () {
        return this.currCol === null
      },
      // 表单标题
      formTitle () {
        switch (this.operteType) {
          case 10:
            return '添加配置'
          case 11:
            return '修改配置'
          case 12:
            return '删除配置'
        }
      },
      // 配置属性表格标题
      optionTitle () {
        return this.currCol ? this.currCol.name + '(' + this.currCol.code + ') 属性值' : ''
      }
    },
    data () {
      return {
        // 表格标题
        tableShow: '系统配置',
        // 表单操作类型
        operteType: 0,
        // 配置表格加载
        listLoading: false,
        // 表格数据
        listData: [],
        // 分页查询参数
        pageParam: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          sidx: null,
          sort: null
        },
        // 查询参数
        pageQuery: {
          queryKey: 'code',
          queryValue: null
        },
        // 高级查询
        advancedSearch: false,
        // 高级查询参数
        queryParam: {},
        // 当前选择行
        currCol: null,
        // 列表选中行
        currList: [],
        // 新增界面是否显示
        formVisible: false,
        formModel: {
          name: null,
          code: null,
          type: 0,
          status: 0
        },
        formAdd: {
          name: null,
          code: null,
          type: 0,
          status: 0
        },
        formValidate: {
          name: [
            {required: true, message: '请输入配置名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入配置编码', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择数据类型'}
          ],
          status: [
            {required: true, message: '请选择配置状态'}
          ]
        },
        // 配置属性面板
        optionVisible: false,
        // 配置属性表格
        optionList: [],
        // 添加配置属性标志
        optionAddFlag: false
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.loadListPage()
      })
    },
    methods: {
      // 加载配置属性列表
      loadListPage () {
        this.listLoading = true
        // 默认排序
        if (this.pageParam.sidx === null) {
          this.pageParam.sidx = 'configId'
        }
        // 请求方法
        let method = this.advancedSearch ? 'post' : 'get'
        // 分页参数
        let param = this.advancedSearch ? this.pageParam : {...this.pageParam, ...this.pageQuery}
        ConfigApi.reqConfigListPage(method, param, this.queryParam).then(data => {
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
      // 加载配置属性信息
      loadOptionList (code) {
        ConfigApi.reqOptionList(code).then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.currCol.optionList = JSON.parse(JSON.stringify(result))
            this.optionList = result
          } else {
            this.$Message.warning(msg)
          }
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
      // select 选择改变
      selectChange (val) {
        ConfigApi.reqConfigUpdateOptionId(this.currCol.configId, val.value).then(data => {
          let {code, msg} = data
          if (code === 0) {
            this.$Message.success('修改成功')
            this.loadListPage()
            this.formVisible = false
          } else {
            this.$Message.error(msg)
          }
        })
      },
      // 取消操作
      cancal () {
        this.resetForm('formModel')
        this.formVisible = false
      },
      // 表格右击
      changeOption (data) {
        this.loadOptionList(data.code)
        this.optionVisible = true
      },
      // 添加
      addData () {
        this.operteType = 10
        this.formVisible = true
        this.formModel = JSON.parse(JSON.stringify(this.formAdd))
      },
      // 编辑
      editData () {
        if (this.currCol.configId) {
          this.operteType = 11
          let configId = this.currCol.configId
          ConfigApi.reqConfigInfo(configId).then((roleData) => {
            let {code, msg, result} = roleData
            if (code === 0) {
              this.formVisible = true
              this.formModel = result
            } else {
              this.$Message.error(msg)
            }
          })
        }
      },
      // 执行删除
      deleteData () {
        let data = this.currCol
        this.$Modal.confirm({
          title: '提示',
          content: '<p>此操作将删除配置 <span style="color: red;">' + data.name + '</span>, 是否继续?</p>',
          onOk: () => {
            ConfigApi.reqConfigDelete(data.configId).then(roleData => {
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
          // 添加配置
          case 10:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                ConfigApi.reqConfigSave(this.formModel).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('添加成功')
                    this.loadListPage()
                    this.formVisible = false
                  } else {
                    this.$Message.error(msg)
                  }
                })
              }
            })
            break
          // 修改配置
          case 11:
            this.$refs['formModel'].validate((valid) => {
              if (valid) {
                ConfigApi.reqConfigUpdate(this.formModel.configId, this.formModel).then(data => {
                  let {code, msg} = data
                  if (code === 0) {
                    this.$Message.success('修改成功')
                    this.loadListPage()
                    this.formVisible = false
                  } else {
                    this.$Message.error(msg)
                  }
                })
              }
            })
            break
        }
      },
      // 添加配置属性
      addOption () {
        this.optionList.push({'code': this.currCol.code})
        this.optionAddFlag = true
      },
      // 删除配置属性
      delOption (index, data) {
        if (data.optionId) {
          this.doDelInfo(data)
        } else {
          this.optionList.splice(index, 1)
          this.optionAddFlag = false
        }
      },
      // 执行更新或保存配置属性
      operOption (index, data) {
        if (data.optionId) {
          this.doUpdateOption(index, data)
        } else {
          this.doSaveOption(index, data)
        }
      },
      // 执行配置属性保存
      doSaveOption (index, data) {
        ConfigApi.reqOptionSave(data).then(data => {
          let {code, msg} = data
          if (code === 0) {
            this.$Message.success('添加成功！')
            this.loadOptionList(this.currCol.code)
            this.optionAddFlag = false
          } else {
            this.$Message.warning(msg)
          }
        })
      },
      // 执行配置属性修改
      doUpdateOption (index, data) {
        ConfigApi.reqOptionUpdate(data.optionId, data).then(data => {
          let {code, msg} = data
          if (code === 0) {
            this.$Message.success('修改成功！')
            this.loadOptionList(this.currCol.code)
          } else {
            this.$Message.warning(msg)
          }
        })
      },
      // 执行配置属性删除
      doDelInfo (data) {
        ConfigApi.reqOptionDelete(data.optionId).then(data => {
          let {code, msg} = data
          if (code === 0) {
            this.$Message.success('删除成功！')
            this.loadOptionList(this.currCol.code)
          } else {
            this.$Message.warning(msg)
          }
        })
      }

    }
  }
</script>
<style lang="less" scoped>


</style>
