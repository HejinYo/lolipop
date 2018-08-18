<style lang="less">
  @import "./home.less";
  @import "../../assets/styles/common.less";
</style>
<template>
  <div class="home-main">
    <Row :gutter="10" >
      <Col :md="24" :lg="8">
        <!-- 个人信息 -->
        <Row>
          <Col :style="{marginBottom: '10px'}">
            <Card>
              <Row type="flex" class="user-infor">
                <Col span="8">
                  <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <img class="avator-img" :src="loginUser.avatar"/>
                  </Row>
                </Col>
                <Col span="16" style="padding-left:6px;">
                  <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <div>
                      <b class="card-user-infor-name">{{loginUser.userName}}</b>
                      <p>{{loginUser.email}}</p>
                    </div>
                  </Row>
                </Col>
              </Row>
              <div class="line-gray"></div>
              <Row class="margin-top-8">
                <Col span="8">
                  <p class="notwrap">上次登录时间:</p></Col>
                <Col span="16" class="padding-left-8">
                  {{loginUser.loginTime}}
                </Col>
              </Row>
              <Row class="margin-top-8">
                <Col span="8">
                  <p class="notwrap">上次登录地点:</p></Col>
                <Col span="16" class="padding-left-8">
                  {{loginUser.loginIp}}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col :md="24" :lg="16">
        <!-- 数字渐变列表 -->
        <Row :gutter="10">
          <i-col :xs="12" :sm="8" :md="8" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" :style="{marginBottom: '10px',height: '107px'}">
            <infor-card  :color="infor.color" :icon="infor.icon" :icon-size="36">
              <count-to :end="infor.count" count-class="count-style"/>
              <p>{{ infor.title }}</p>
            </infor-card>
          </i-col>
        </Row>
      </Col>
    </Row>
    <Row :gutter="10" >
      <i-col :md="24" :lg="8">
        <Card >
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16">
        <Card >
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
  /* import dataSourcePie from './components/dataSourcePie.vue'
   import visiteVolume from './components/visiteVolume.vue'
   import inforCard from './components/inforCard.vue'
   dataSourcePie,
         visiteVolume,
         inforCard */
  import { mapGetters } from 'vuex'
  import InforCard from '@/components/info-card'
  import CountTo from '@/components/count-to'
  import { ChartPie, ChartBar } from '@/components/charts'

  export default {
    name: 'home',
    components: {
      InforCard,
      CountTo,
      ChartPie,
      ChartBar
    },
    data () {
      return {
        inforCardData: [
          { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
          { title: '累计点击', icon: 'md-locate', count: 23432, color: '#19be6b' },
          { title: '新增问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
          { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
          { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
          { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
        ],
        pieData: [
          {value: 335, name: '直接访问'},
          {value: 310, name: '邮件营销'},
          {value: 234, name: '联盟广告'},
          {value: 135, name: '视频广告'},
          {value: 1548, name: '搜索引擎'}
        ],
        barData: {
          Mon: 13253,
          Tue: 34235,
          Wed: 26321,
          Thu: 12340,
          Fri: 24643,
          Sat: 1322,
          Sun: 1324
        },
        count: {
          createUser: 496,
          visit: 3264,
          collection: 24389305,
          transfer: 39503498
        }
      }
    },
    computed: {
      ...mapGetters([
        'loginUser'
      ])
    },
    methods: {}
  }
</script>
