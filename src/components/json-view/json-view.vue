<template>
  <span>
    <Poptip transfer trigger="hover" :placement="placement">
      <slot name="button"></slot>
      <div slot="content">
        <div style="max-height: 300px">
          <span v-html="processData()" ></span>
        </div>
      </div>
    </Poptip>
  </span>
</template>
<script>
  export default {
    name: 'json-view',
    components: {},
    props: {
      value: {
        type: [Object, String]
      },
      placement: {
        type: String,
        default: 'top'
      }
    },
    data () {
      return {
        TypeEnum: {
          TYPE_STRING: 'string',
          TYPE_INT: 'number',
          TYPE_OBJECT: 'object',
          TYPE_BOOLEAN: 'boolean'
        }
      }
    },
    methods: {
      processData () {
        try {
          let json = JSON.parse(this.value)
          return this.formatJson(json, 1)
        } catch (e) {
          return ''
        }
      },
      formatJson (jsonObj, tabIndex) {
        let innerhtml = ''
        let idx = 0
        let isArray = jsonObj instanceof Array
        let length = 0

        if (jsonObj != null) {
          length = Object.keys(jsonObj).length
        }
        for (let obj in jsonObj) {
          let isD = idx + 1 !== length

          let preInnerHtml = ''
          if (typeof jsonObj[obj] === 'object') {
            if (isArray) {
              preInnerHtml = this.getObjectArrayDiv(this.formatJson(jsonObj[obj], tabIndex + 1), isD)
            } else {
              preInnerHtml = this.getObjectDiv(obj, this.formatJson(jsonObj[obj], tabIndex + 1), isD)
            }
          } else {
            if (isArray) {
              preInnerHtml = this.getArrayDiv(jsonObj[obj], isD)
            } else {
              preInnerHtml = this.getDiv(obj, jsonObj[obj], isD)
            }
          }
          innerhtml += preInnerHtml
          idx++
        }

        return this.getPanel(innerhtml, tabIndex, isArray, length)
      },
      getDiv (key, value, isD) {
        return '<div>' + this.getTitleSpan(key) + ':' + this.getValueSpan(value) + (isD ? ',' : '') + '</div>'
      },
      getObjectDiv (key, value, isD) {
        return '<div>' + this.getTitleSpan(key) + ':' + value + (isD ? ',' : '') + '</div>'
      },
      getObjectArrayDiv (value, isD) {
        return '<div>' + value + (isD ? ',' : '') + '</div>'
      },
      getArrayDiv (value, isD) {
        return '<div>' + this.getValueSpan(value) + (isD ? ',' : '') + '</div>'
      },
      getTitleSpan (value) {
        return "<span class='key'>\"" + value + '"</span>'
      },
      getValueSpan (value) {
        let type = typeof value

        switch (type) {
          case this.TypeEnum.TYPE_STRING:
            return "<span class='value_string'>\"" + value + '"</span>'
          case this.TypeEnum.TYPE_INT:
            return "<span class='value_int'>" + value + '</span>'
          case this.TypeEnum.TYPE_BOOLEAN:
            return "<span class='value_bool'>" + value + '</span>'
        }
        return 'error'
      },
      getPanel (innerHtml, tabIndex, isArray, index) {
        if (isArray) {
          return "<span class=\"\"><i class='panel-suo'>-</i>[</span><div class=\"tab_" + tabIndex + '">' + innerHtml + "</div><label class=\"tips\">Array <span class='tips_math'>" + index + '<span></label><span>]</span>'
        } else {
          return "<span class=\"\"><i class='panel-suo'>-</i>{</span><div class=\"tab_" + tabIndex + '">' + innerHtml + '</div><label class="tips">Object{...}</label><span>}</span>'
        }
      }
    }
  }
</script>

<style lang="less">
  .tool-panel {
    padding: 20px;
    margin-bottom: 15px;
    min-height: 500px;
    line-height: 1.42857143;
    background-color: #ffffff;
    font: 400 14px "Georgia", "Xin Gothic", "Hiragino Sans GB", "Droid Sans Fallback", "Microsoft YaHei", sans-serif;
    color: #444443;
  }

  .tool-div {
    padding-bottom: 40px;
  }

  .tool-input-div {
    padding-bottom: 10px;
    border-bottom: 1px solid #f4f4f4;
  }

  .tool-input-div p {
    margin-top: 20px;
  }

  #error-span {
    display: none;
  }

  /* tool 工具箱*/
  .tab_0 {
  }

  .tab_1 {
    margin-left: 20px;
  }

  .tab_2 {
    margin-left: 10px;
  }

  .tab_3 {
    margin-left: 20px;
  }

  .tab_4 {
    margin-left: 30px;
  }

  .tab_5 {
    margin-left: 40px;
  }

  .tab_6 {
    margin-left: 50px;
  }

  .tab_7 {
    margin-left: 60px;
  }

  .key {
    color: #92278f;
    font-weight: bold;
  }

  .value_string {
    color: #3ab54a;
    font-weight: bold;
  }

  .value_int {
    color: #25aae2;
    font-weight: bold;
  }

  .value_bool {
    color: #555;
  }

  .panel-suo {
    padding: 0 2px;
    cursor: pointer;
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    border: 1px solid #555555;
    border-radius: 3px;
  }

  .tips {
    display: none;
  }

  .tips_math {
    color: #25aae2;
    font-weight: bold;
  }

  .json-code-div {
    margin: 20px;
  }
</style>
