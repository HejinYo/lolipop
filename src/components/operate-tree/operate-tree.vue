<template>
  <div class="operate-tree">
    <i-Input v-model="filterText" placeholder="过滤节点" clearable class="filter-input"></i-Input>
    <div :style="{ height: `${this.clientHeight - 240}px`,overflowY: 'auto'}">
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
        draggable
        @node-drop="handleDrop"
        @node-contextmenu="handleContextmenu"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <span v-if="data[icon]" class="span-icon"><Icon :type="data.icon"></Icon></span>
          {{ data[label] }}
          <Poptip v-if="false" transfer trigger="hover" placement="right">
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
          <Dropdown transfer trigger="custom" placement="right-start"
                    :visible="currData===data[nodeKey]" @on-clickoutside="clickoutside">
            <DropdownMenu slot="list">
              <ul class="ivu-dropdown-menu">
                <li class="ivu-dropdown-item" @click="addNode(data,node)">添加</li>
                <li class="ivu-dropdown-item" v-if="nodeEdit || data[nodeKey]!==1" @click="editNode(data,node)">修改</li>
                <li class="ivu-dropdown-item" v-if="nodeEdit || data[nodeKey]!==1" @click="delNode(data,node)">删除</li>
               </ul>
            </DropdownMenu>
          </Dropdown>

        </span>
        <span>
        </span>
      </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

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
    computed: {
      ...mapGetters([
        'clientHeight'
      ])
    },
    data () {
      return {
        currData: null,
        filterText: ''
      }
    },
    methods: {
      test (data, node) {
        alert(data.resName)
      },
      // 节点过滤
      filterNode (value, data) {
        if (!value) return true
        return data[this.label].indexOf(value) !== -1
      },
      // 树节点点击
      handleNodeClick (data, node, ref) {
        this.currData = null
        this.$emit('node-click', data, node, ref)
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
      },
      // 鼠标右击
      handleContextmenu (event, data, node) {
        this.currData = data[this.nodeKey]
        this.$emit('node-contextmenu', event, data, node)
      },
      // 被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event
      handleDrop (node, innerNode, location, event) {
        this.$emit('node-drop', node, innerNode, location, event)
      },
      // 下拉菜单点击外部
      clickoutside () {
        this.currData = null
      }
    },
    mounted () {
      // 保证完全挂载
      this.$nextTick(function () {

      })
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
