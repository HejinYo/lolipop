<template>
  <i-select :label-in-value="true" v-model="select" :placeholder="placeholder">
    <i-option v-show="false" v-for="item in data.list" :value="item.value" :key="item.value">{{ item.label }}</i-option>
    <el-tree ref="tree" highlight-current default-expand-all :expand-on-click-node="false" node-key="value" :props="defaultProps"
             :data="data.tree" @node-click="nodeClick"></el-tree>
  </i-select>
</template>
<script>
  export default {
    name: 'tree-select',
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
      return {}
    },
    methods: {
      nodeClick (val) {
        this.$emit('update:select', val.value)
        this.$emit('node-click', val.value)
      }
    },
    watch: {
      select (val) {
        this.$refs.tree.setCurrentKey(val)
      }
    },
    mounted () {
      this.$nextTick(() => {
        // 保证完全挂载
        this.$refs.tree.setCurrentKey(this.select)
      })
    }
  }
</script>
<style>

</style>
