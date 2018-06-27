<style lang="less">
  @import "./home.less";
  @import "../../assets/styles/common.less";
</style>
<template>
  <div class="home-main">
    <Row :gutter="10">
      <Col :md="24" :lg="8">
        <!-- 个人信息 -->
        <Row class-name="home-page-row1" :gutter="10">
          <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
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
      <Col :md="24" :lg="8">
        <!-- 数字渐变列表 -->
        <Row :gutter="5">
          <Col :xs="24" :sm="12" :md="12" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="user_created_count"
              :end-val="count.createUser"
              iconType="android-person-add"
              color="#2d8cf0"
              intro-text="今日新增用户"
            ></infor-card>
          </Col>
          <Col :xs="24" :sm="12" :md="12" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="visit_count"
              :end-val="count.visit"
              iconType="ios-eye"
              color="#64d572"
              :iconSize="50"
              intro-text="今日浏览量"
            ></infor-card>
          </Col>
          <Col :xs="24" :sm="12" :md="12" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="collection_count"
              :end-val="count.collection"
              iconType="upload"
              color="#ffd572"
              intro-text="今日数据采集量"
            ></infor-card>
          </Col>
          <Col :xs="24" :sm="12" :md="12" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="transfer_count"
              :end-val="count.transfer"
              iconType="shuffle"
              color="#f25e43"
              intro-text="今日服务调用量"
            ></infor-card>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row :gutter="10" class="margin-top-10">
      <!-- 上周每日来访量统计 -->
      <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="android-map"></Icon>
            上周每日来访量统计
          </p>
          <div class="data-source-row">
            <visite-volume></visite-volume>
          </div>
        </Card>
      </Col>
      <!--数据来源统计-->
      <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="ios-pulse-strong"></Icon>
            数据来源统计
          </p>
          <div class="data-source-row">
            <data-source-pie></data-source-pie>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import dataSourcePie from './components/dataSourcePie.vue'
  import visiteVolume from './components/visiteVolume.vue'
  import inforCard from './components/inforCard.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'home',
    components: {
      dataSourcePie,
      visiteVolume,
      inforCard
    },
    data () {
      return {
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
