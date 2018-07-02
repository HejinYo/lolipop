<template>
  <div>
    <span v-text="label" v-if="textShow"></span>
    <slot :dictLabel="label"></slot>
  </div>
</template>

<script>
  /**
   * 数据字典显示组件
   */
  import { mapActions } from 'vuex'
  import * as dictCode from '@/consts/dict-code'

  export default {
    name: 'dict-show',
    props: {
      dictValue: null,
      refresh: {
        default: false
      },
      code: {
        default: null
      },
      textShow: {
        default: true
      }
    },
    data () {
      return {
        dictData: [],
        label: null
      }
    },
    methods: {
      ...mapActions([
        'loadDictData'
      ]),
      findDictCode (findValue) {
        this.label = findValue
        let dict = dictCode[this.code]
        if (dict) {
          this.loadDictData(dictCode[this.code], this.refresh).then(value => {
            this.dictData = value
            for (let item of this.dictData) {
              if (item.value === findValue) {
                this.label = item.label
                break
              }
            }
          })
        }
      }
    },
    watch: {
      dictValue (val) {
        this.findDictCode(val)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.findDictCode(this.dictValue)
      }
      )
    }
  }
</script>
<style>
</style>
