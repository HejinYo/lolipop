<template>
  <div class="operate-tree">
    <i-Input v-model="filterText" placeholder="过滤节点" clearable class="filter-input"></i-Input>
    <div :style="{ height: editHeigth,overflowY: 'auto'}">
      <el-tree
        :data="data"
        :ref="refName"
        :node-key="nodeKey"
        :default-expanded-keys="expandedKeys"
        :expand-on-click-node="false"
        :default-expand-all="defaultExpandAll"
        :accordion="accordion"
        highlight-current
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <Poptip trigger="hover" placement="right">
            <span v-if="data[icon]" class="span-icon"><Icon :type="data.icon"></Icon></span>
            {{ data[label] }}
            <div slot="content" style="width: auto">
                <Button @click="addNode(data,node)" type="primary" size="small">添加</Button>
                <span v-if="nodeEdit || data[nodeKey]!==1">
                  <Button @click="editNode(data,node)" type="info" size="small">修改</Button>
                  <Button @click="delNode(data,node)" type="error" size="small">删除</Button>
                </span>
            </div>
           </Poptip>
          </span>
        <span>
        </span>
      </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'operate-tree',
    props: {
      refName: {
        type: String,
        default: 'treeEdit'
      },
      nodeKey: {
        type: String,
        default: 'value'
      },
      label: {
        type: String,
        default: 'label'
      },
      value: {
        type: String,
        default: 'value'
      },
      icon: {
        type: String,
        default: 'icon'
      },
      // 只展开一个节点
      accordion: {
        type: Boolean,
        default: false
      },
      // 展开所有
      defaultExpandAll: {
        type: Boolean,
        default: false
      },
      nodeEdit: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: []
      },
      expandedKeys: {
        request: false,
        type: Array,
        default: () => {
          return [1]
        }
      }
    },
    data () {
      return {
        filterText: '',
        editHeigth: `${document.documentElement.clientHeight - 280}px`
      }
    },
    methods: {
      // 节点过滤
      filterNode (value, data) {
        if (!value) return true
        return data[this.label].indexOf(value) !== -1
      },
      // 树节点点击
      handleNodeClick (data, node, ref) {
        this.$emit('node-click', data, node)
        this.$emit('treeDel', data, node)
        this.$emit('treeAdd', data, node)
      },
      // 添加节点
      addNode (data, node) {
        this.$emit('node-add', data, node)
      },
      // 编辑节点
      editNode (data, node) {
        this.$emit('node-edit', data, node)
      },
      // 删除节点
      delNode (data, node) {
        this.$emit('node-del', data, node)
      }
    },
    mounted () {
      const _this = this
      window.onresize = function temp () {
        _this.editHeigth = `${document.documentElement.clientHeight - 280}px`
      }
    },
    watch: {
      filterText (val) {
        this.$refs[this.refName].filter(val)
      }
    }
  }
</script>

<style lang="less">
  .operate-tree {

    .filter-input {
      padding-bottom: 5px;
    }
    .span-icon {
      padding-right: 4px
    }

  }

</style>
