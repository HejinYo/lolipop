<template>
  <div>
    <Row>
      <Col span="12">
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
</style>
