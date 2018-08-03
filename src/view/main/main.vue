<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="210" :collapsed-width="64" v-model="collapsed" :style="{overflowY:collapsed?'unset':'auto'}">
        <side-menu v-if="menuList.length > 0" accordion :active-name="$route.name" :collapsed="collapsed"
                   @on-select="turnToPage" @on-open-change="handleOnOpenChange" :menu-list="menuList">
          <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
          <div class="logo-con nav-header" style="height: auto">
            <img v-show="!collapsed" :src="maxLogo" key="max-logo"/>
            <img v-show="collapsed" :src="minLogo" key="min-logo"/>
          </div>
        </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <message-tip v-model="messageCount"></message-tip>
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <right-sidebar/>
          <user :user-avator="userAvator" :user-name="userName"/>
        </header-bar>
      </Header>
      <Content>
        <Layout>
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
  import SideMenu from './components/side-menu'
  import HeaderBar from './components/header-bar'
  import TagsNav from './components/tags-nav'
  import User from './components/user'
  import FullScreen from './components/full-screen'
  import MessageTip from './components/message-tip'
  import RightSidebar from './components/right-sidebar'
  import { mapMutations, mapActions } from 'vuex'
  import { getNewTagList, getNextName } from '@/libs/util'
  import minLogo from '@/assets/images/logo-min.png'
  import maxLogo from '@/assets/images/logo.png'
  import './main.less'

  export default {
    name: 'Main',
    components: {
      SideMenu,
      HeaderBar,
      TagsNav,
      User,
      FullScreen,
      MessageTip,
      RightSidebar
    },
    data () {
      return {
        collapsed: false,
        isFullScreen: false,
        minLogo,
        maxLogo
      }
    },
    computed: {
      tagNavList () {
        return this.$store.state.app.tagNavList
      },
      tagRouter () {
        return this.$store.state.app.tagRouter
      },
      userAvator () {
        return this.$store.state.user.avatorImgPath
      },
      userName () {
        return this.$store.state.user.userName
      },
      cacheList () {
        return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
      },
      menuList () {
        return this.$store.getters.menuList
      },
      messageCount () {
        return this.$store.getters.messageCount
      }
    },
    methods: {
      ...mapMutations([
        'setBreadCrumb',
        'setTagNavList',
        'addTag'
      ]),
      ...mapActions([
        'getUserInfo',
        'getUserMenu'
      ]),
      turnToPage (name) {
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1])
          return
        }
        this.$router.push({
          name: name
        })
      },
      handleCollapsedChange (state) {
        this.collapsed = state
      },
      handleCloseTag (res, type, name) {
        const nextName = getNextName(this.tagNavList, name)
        this.setTagNavList(res)
        if (type === 'all') this.turnToPage('home')
        else if (this.$route.name === name) this.$router.push({name: nextName})
      },
      handleClick (item) {
        this.turnToPage(item.name)
      },
      handleOnOpenChange (nameList) {

      },
      fullscreenChange (isFullScreen) {
        // console.log(isFullScreen);
      }
    },
    watch: {
      '$route' (newRoute) {
        this.setBreadCrumb(newRoute.matched)
        this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      }
    },
    mounted () {
      // 保证完全挂载
      this.$nextTick(function () {
        // 监听滚动条
        // window.addEventListener('resize', this.scrollBarResize)
        // 获取用户菜单
        this.getUserMenu()
        // 获取用户信息
        this.getUserInfo()
      })

      /**
       * @description 初始化设置面包屑导航和标签导航
       */
      this.setTagNavList()
      this.addTag(this.$store.state.app.homeRoute)
      this.setBreadCrumb(this.$route.matched)
    }
  }
</script>
