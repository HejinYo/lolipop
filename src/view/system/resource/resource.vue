<template>
  <div>
    <div class="split-pane-con">
          <split-pane :style="{height: '100%'}" :min="20" :max="60" direction="horizontal" v-model="triggerOffset">
            <div slot="left">
              <Card>
                <p slot="title">资源树</p>
                <div>
                  <operate-tree
                    :data="resData"
                    node-key="resId"
                    label="resName"
                    icon="icon"
                    :accordion="false"
                    default-expand-all
                  >
                  </operate-tree>
                </div>
              </Card>
            </div>
            <div slot="right" class="split-pane-right-con">
            </div>
          </split-pane>
    </div>
  </div>

</template>

<script>
  import OperateTree from '@/components/operate-tree'
  import SplitPane from '@/components/split-pane'
  import { reqResourceOperateTree } from '@/api/resource.js'

  export default {
    name: 'sys-resource',
    components: {
      OperateTree,
      SplitPane
    },
    data () {
      return {
        triggerOffset: 20,
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
      getResourceTreeData () {
        reqResourceOperateTree().then((data) => {
          let {code, result} = data
          if (code === 0) {
            this.resData = result.tree
          }
        })
      }
    }
  }
</script>
