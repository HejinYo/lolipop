<template>
  <div>
    <i-select v-model="select" :placeholder="placeholder">
      <i-option v-show="false" v-for="item in data.list" :value="item[value]" :key="item[value]">{{ item[label] }}</i-option>
      <el-tree ref="tree" highlight-current default-expand-all :expand-on-click-node="false" :node-key="value" :props="defaultProps"
               :data="data.tree" @node-click="nodeClick"></el-tree>
    </i-select>
  </div>
</template>
<script>
  export default {
    name: 'tree-select',
    props: {
      name: null,
      select: null,
      // 选择框默认文字
      placeholder: {
        type: String,
        default: '请选择'
      },
      label: {
        type: String,
        default: 'label'
      },
      value: {
        type: String,
        default: 'value'
      },
      children: {
        type: String,
        default: 'children'
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
      }
    },
    data () {
      return {
        selectModel: 7,
        // 数据的key value
        defaultProps: {
          children: this.children,
          label: this.label
        }
      }
    },
    methods: {
      nodeClick (val) {
        this.$emit('update:select', val[this.value])
        this.$emit('update:name', val[this.label])
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
