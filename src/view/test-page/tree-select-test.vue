<template>
  <Row>
    <Col span="4">
      <Form ref="formInline" :label-width="80">
        <FormItem label="单选树">
          <tree-select v-bind:select.sync="selectData" :data="data" placeholder="选择数据"></tree-select>
        </FormItem>
        <FormItem label="多选树">
          <tree-select-multiple v-bind:select.sync="selectDataList" :data="data" placeholder="选择数据"></tree-select-multiple>
        </FormItem>
      </Form>
    </Col>
  </Row>
</template>
<script>
  import TreeSelect from '@/components/tree-select'
  import TreeSelectMultiple from '@/components/tree-select/tree-select-multiple'

  export default {
    name: 'tree-select-test',
    components: {
      TreeSelect,
      TreeSelectMultiple
    },
    data () {
      return {
        selectData: 2,
        selectDataList: [3, 5],
        data: {
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
        }
      }
    },
    methods: {}
  }
</script>
<style>

</style>
