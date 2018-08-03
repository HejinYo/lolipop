<template>
  <div class="tip-common">
    <!-- <Tooltip :content="value > 0 ? '有' + value + '条未读消息' : '无未读消息'" placement="bottom">
       <Badge :count="value">
         <Icon type="md-notifications-outline" :size="22"></Icon>
       </Badge>
     </Tooltip>-->
    <Poptip placement="bottom-end" class="dev-header-notification">
      <Badge :count="value">
        <Icon type="md-notifications-outline" :size="22"></Icon>
      </Badge>

      <div slot="content">
        <div class="dev-header-notification">
          <Row class="dev-header-tabs dev-common-unselect">
            <Col span="8" class="dev-header-tab on"><span>通知</span> <span class="dev-header-tab-badge ivu-badge"> <!----></span></Col>
            <Col span="8" class="dev-header-tab"><span>关注</span> <span class="dev-header-tab-badge ivu-badge"> <!----></span></Col>
            <Col span="8" class="dev-header-tab"><span>系统</span> <span class="dev-header-tab-badge ivu-badge"> <!----></span></Col>
          </Row>
          <div class="dev-header-notification-main">
            <div class="dev-header-notification-list">
              <div class="dev-load-more">
                <div class="dev-load-more-empty" v-show="false">
                  暂时没有内容
                </div>
                <div class="dev-load-more-empty-notification">
                  <img src="https://file.iviewui.com/dev-dist/356efdc3a7c62a58403fb14854c46c71.svg" alt="not found">
                  <p>目前没有通知</p></div>
                <div class="dev-load-more-empty-user" v-show="false">
                  <Card class="ivu-card ivu-card-dis-hover ivu-card-shadow"><!----> <!---->
                    <img src="https://file.iviewui.com/dev-dist/a8899afd8b36404e2829f9aaa18881b8.png">
                    <p>暂时没有内容</p>
                  </Card>
                </div>
              </div>
            </div>
            <div class="dev-header-notification-list" v-show="false">
              <div class="dev-header-notification-list-tip" v-show="false">这些人最近关注了你</div>
              <div class="dev-load-more">
                <div class="dev-load-more-empty" v-show="false">
                  暂时没有内容
                </div>
                <div class="dev-load-more-empty-notification"><img src="https://file.iviewui.com/dev-dist/356efdc3a7c62a58403fb14854c46c71.svg" alt="not found">
                  <p>目前没有通知</p></div>
                <div class="dev-load-more-empty-user" v-show="false">
                  <Card>
                    <img src="https://file.iviewui.com/dev-dist/a8899afd8b36404e2829f9aaa18881b8.png">
                    <p>暂时没有内容</p>
                  </Card>
                </div>
              </div>
            </div>
            <div class="dev-header-notification-list" v-show="false">
              <div class="dev-load-more">
                <div class="dev-load-more-empty" v-show="false">
                  暂时没有内容
                </div>
                <div class="dev-load-more-empty-notification"><img src="https://file.iviewui.com/dev-dist/356efdc3a7c62a58403fb14854c46c71.svg" alt="not found">
                  <p>目前没有通知</p></div>
                <div class="dev-load-more-empty-user" v-show="false">
                  <Card><!----> <!---->
                    <img src="https://file.iviewui.com/dev-dist/a8899afd8b36404e2829f9aaa18881b8.png">
                    <p>暂时没有内容</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <div class="dev-header-notification-footer" v-show="false">
            <Button type="text" size="small"><!---->
              <Icon type="md-done-all"></Icon>
              <span>全部标记为已读</span>
            </Button>
          </div>
        </div>
      </div>
    </Poptip>
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

  .dev-header-tabs {
    text-align: center;
    border-bottom: 1px solid #dcdee2
  }

  .dev-common-unselect {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .dev-header-tabs {
    text-align: center;
    border-bottom: 1px solid #dcdee2
  }

  .dev-header-tab {
    padding: 4px 0 8px;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    color: #515a6e
  }

  .dev-header-tab:hover {
    color: #17233d
  }

  .dev-header-tab:after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background-color: transparent;
    position: absolute;
    left: 0;
    bottom: -1px
  }

  .dev-header-tab.on, .dev-header-tab.on:hover {
    color: #2d8cf0
  }

  .dev-header-tab.on:after {
    background-color: #2d8cf0
  }

  .dev-header-tab span {
    vertical-align: middle
  }

  .dev-header-tab-badge .ivu-badge-count {
    background: #e6ebf1;
    color: #808695;
    min-width: 16px;
    height: 16px;
    line-height: 14px;
    border-radius: 8px;
    padding: 0 4px
  }

  .dev-header-notification-main {
    height: 300px;
    overflow: auto
  }

  .dev-header-notification-list .dev-load-more {
    margin: 10px
  }

  .dev-header-notification-list-tip {
    text-align: center;
    padding: 12px
  }

  .dev-load-more {
    margin-top: 12px
  }

  .dev-load-more-empty, .dev-load-more-finish {
    padding: 16px
  }

  .dev-load-more-empty, .dev-load-more-empty-notification, .dev-load-more-finish {
    text-align: center;
    color: #b2b2b2;
    text-shadow: 0 1px 1px #fff
  }

  .dev-load-more-empty-notification img {
    margin-top: 50px;
    margin-bottom: 20px
  }

  .dev-load-more-empty-user {
    text-align: center;
    color: #b2b2b2;
    text-shadow: 0 1px 1px #fff
  }

  .dev-load-more-empty-user img {
    height: 150px
  }

  .dev-header-notification .ivu-poptip-body {
    width: 300px;
    overflow: hidden;
    padding: 8px 0
  }


</style>
