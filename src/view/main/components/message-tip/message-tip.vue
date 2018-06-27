<template>
    <div @click="showMessage" class="message-con">
        <Tooltip :content="value > 0 ? '有' + value + '条未读消息' : '无未读消息'" placement="bottom">
            <Badge :count="value" >
                <Icon type="ios-bell" :size="22"></Icon>
            </Badge>
        </Tooltip>
    </div>
</template>

<script>
export default {
  name: 'messageTip',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  methods: {
    showMessage () {
      this.$router.push({
        name: 'message'
      })
    }
  }
}
</script>

<style lang="less">
  .message-con {
    margin: 0 3px;
    vertical-align: middle;
    line-height: 1;
    display: inline-block;
    width: 30px;
    text-align: center;
    cursor: pointer;
  }
</style>
