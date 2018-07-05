<template>
  <div>
    <Row>
      <Col span="12">
        <Card>
          <p slot="title">编辑树</p>
          <div>
            <Card>
              <p slot="title">使用 scoped slot</p>
              <div>
                <el-tree
                  :data="data5"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                      <Poptip trigger="hover" placement="right">
                        {{ node.label }}
                        <div slot="content" style="width: auto">
                            <Button @click="test(data)" type="primary" size="small">添加</Button>
                            <Button type="info" size="small">编辑</Button>
                          <!--<Button type="error" size="small">删除</Button>-->
                            <Poptip
                              width="200"
                              confirm
                              @on-ok="test(data)"
                              @on-cancel="test(data)">
                                  <div slot="title">
                                    <div><span style="font-size: 18px">确定删除嘛>_<？</span></div>
                                    <div> <Tag color="blue">{{ node.label }}</Tag></div>
                                  </div>
                                  <Button type="error" size="small">删除</Button>
                              </Poptip>
                        </div>
                       </Poptip>
                      </span>
                    <span>
                    </span>
                  </span>
                </el-tree>
              </div>
            </Card>
          </div>
        </Card>
      </Col>
      <Col span="12">
        <Card>
          <p slot="title">选择树</p>
          <Form ref="formInline" :label-width="80">
            <FormItem label="单选树">
              <tree-select v-bind:select.sync="selectData" :data="data_select" placeholder="选择数据"></tree-select>
            </FormItem>
            <FormItem label="多选树">
              <tree-select-multiple v-bind:select.sync="selectDataList" :data="data_select" placeholder="选择数据"></tree-select-multiple>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>

    <Row>
      <Col span="12">
        <operate-tree
          :data="resData"
          node-key="resId"
          label="resName"
          icon="icon"
          accordion
        >
          <span slot="prepend">http://</span>
        </operate-tree>
      </Col>
    </Row>
  </div>
</template>
<script>
  import TreeSelect from '@/components/tree-select'
  import TreeSelectMultiple from '@/components/tree-select/tree-select-multiple'
  import OperateTree from '@/components/operate-tree'
  import ResourceApi from '@/api/system/resource-api'

  export default {
    name: 'tree-select-test',
    components: {
      TreeSelect,
      TreeSelectMultiple,
      OperateTree
    },
    data () {
      const data = [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }]
      return {
        selectData: 2,
        selectDataList: [3, 5],
        data_select: {
          list: [
            {
              value: 1,
              label: 'New York'
            },
            {
              value: 2,
              label: 'London'
            },
            {
              value: 3,
              label: 'Sydney'
            },
            {
              value: 4,
              label: 'Ottawa'
            },
            {
              value: 5,
              label: 'Paris'
            },
            {
              value: 6,
              label: 'Canberra'
            },
            {
              value: 7,
              label: 'China'
            }
          ],
          tree: [
            {
              label: 'New York',
              value: 1,
              children: [
                {
                  label: 'London',
                  value: 2,
                  children: [
                    {
                      label: 'Ottawa',
                      value: 4
                    },
                    {
                      label: 'Paris',
                      value: 5
                    }
                  ]
                },
                {
                  label: 'Sydney',
                  value: 3,
                  children: [
                    {
                      label: 'Canberra',
                      value: 6
                    },
                    {
                      label: 'China',
                      value: 7
                    }
                  ]
                }
              ]
            }
          ]
        },
        data4: JSON.parse(JSON.stringify(data)),
        data5: JSON.parse(JSON.stringify(data)),
        resData: []
      }
    },
    mounted () {
      this.$nextTick(function () {
        // 保证完全挂载
        this.getResourceTreeData()
      })
    },
    methods: {
      test (val) {
        console.log(val)
      },
      getResourceTreeData () {
        ResourceApi.reqResourceOperateTree().then((data) => {
          let {code, result} = data
          if (code === 0) {
            this.resData = result.tree
          }
        })
      }
    }
  }
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
