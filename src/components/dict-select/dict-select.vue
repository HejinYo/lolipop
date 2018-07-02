<template>
  <div>
    <span v-if="type==='select'">
      <Select v-model="selectModel" :transfer="transfer" :clearable="clearable" :label-in-value="labelInValue"
              :size="size" :placeholder="placeholder" :not-found-text="notFoundText" :placement="placement"
              @on-change="onChange" @on-clear="onClear" @on-open-change="openChange">
        <Option v-for="item in dictData" :value="item.value" :label="item.label" :key="item.value"></Option>
      </Select>
    </span>

    <span v-if="type==='radio'">
      <RadioGroup v-model="selectModel">
        <Radio v-for="item in dictData" :label="item.value" :key="item.value">{{item.label}}</Radio>
      </RadioGroup>
    </span>
  </div>
</template>

<script>
  /**
   * 数据字典下拉选择组件
   */
  import { mapActions } from 'vuex'
  import * as dictCode from '@/consts/dict-code'

  export default {
    props: {
      // 绑定模型
      model: null,
      // 每次都加载
      refresh: {
        type: Boolean,
        default: false
      },
      // 字典编码
      code: {
        type: String,
        default: null
      },
      // 字典编码
      type: {
        type: String,
        default: 'select'
      },
      // 在body上
      transfer: {
        type: Boolean,
        default: false
      },
      // 可清空
      clearable: {
        type: Boolean,
        default: false
      },
      // 在返回选项时，是否将 label 和 value 一并返回，默认只返回 value
      labelInValue: {
        type: Boolean,
        default: false
      },
      // 大小可选值为large、small、default或者不填
      size: {
        type: String,
        default: 'default'
      },
      // 选择框默认文字
      placeholder: {
        type: String,
        default: '请选择'
      },
      // 当下拉列表为空时显示的内容
      notFoundText: {
        type: String,
        default: '无匹配数据'
      },
      // 弹窗的展开方向，可选值为 bottom 和 top，2.12.0 版本开始支持自动识别
      placement: {
        type: String,
        default: 'bottom'
      }
    },
    data () {
      return {
        selectModel: null,
        dictData: []
      }
    },
    methods: {
      ...mapActions([
        'loadDictData'
      ]),
      // 选中的Option变化时触发，默认返回 value，如需返回 label，详见 label-in-value 属性
      onChange (val) {
        this.$emit('on-change', val)
      },
      // 点击清空按钮时触发
      onClear () {
        this.$emit('on-clear')
      },
      // 下拉框展开或收起时触发 true / false
      openChange (val) {
        this.$emit('on-open-change', val)
      }
    },
    watch: {
      model (val) {
        this.selectModel = val
      },
      selectModel (val) {
        this.$emit('update:model', val)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.loadDictData(dictCode[this.code], this.refresh).then(value => {
          this.dictData = value
        })
        this.selectModel = this.model
      }
      )
    }
  }
</script>
<style>
</style>
