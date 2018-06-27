<template>
  <i-select :label-in-value="true" v-model="selectDataList" multiple @on-change="change">
    <i-option v-show="false" v-for="item in data.list" :value="item.value" :key="item.value">{{ item.label }}</i-option>
    <el-tree check-strictly ref="tree" :default-checked-keys="select" :expand-on-click-node="false" check-on-click-node
             default-expand-all show-checkbox node-key="value" :props="defaultProps" :data="data.tree" @check="check"></el-tree>
  </i-select>
</template>
<script>
  export default {
    name: 'tree-select-multiple',
    props: {
      select: null,
      // 选择框默认文字
      placeholder: {
        type: String,
        default: '请选择'
      },
      // select和tree数据
      data: {
        type: Object,
        default: function () {
          return {
            list: [],
            tree: []
          }
        }
      },
      // 数据的key value
      defaultProps: {
        default: function () {
          return {
            children: 'children',
            label: 'label'
          }
        }
      }
    },
    data () {
      return {
        selectDataList: []
      }
    },
    methods: {
      nodeClick (val) {
        this.$emit('update:select', val.value)
        this.$emit('node-click', val.value)
      },
      change (val) {
        this.$refs.tree.setCheckedNodes(val)
        this.$emit('update:select', val)
      },
      check (val) {
        let list = []
        let checks = this.$refs.tree.getCheckedNodes()
        checks.forEach((item, index) => {
          list.push(item.value)
        })
        this.selectDataList = list
        this.$emit('update:select', list)
      }
    },
    watch: {
      select (val) {
        this.selectDataList = val
        this.$refs.tree.setCheckedNodes(val)
      }
    },
    mounted () {
      this.$nextTick(function () {
        // 保证完全挂载
        this.selectDataList = this.select
        this.$refs.tree.setCheckedNodes(this.select)
      })
    }
  }
</script>
<style>

</style>
