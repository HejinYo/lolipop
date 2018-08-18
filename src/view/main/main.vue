<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="210" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <!-- 菜单数据加载完才开始渲染 -->
      <side-menu  v-if="menuList.length > 0"  accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo"/>
          <img v-show="collapsed" :src="minLogo" key="min-logo"/>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator" :user-name="userName"/>
          <right-sidebar style="margin-right: 30px;"/>
          <full-screen v-model="isFullScreen"  style="margin-right: 10px;"></full-screen>
          <message-tip v-model="messageCount" style="margin-right: 10px;"></message-tip>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
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
  import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
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
      local () {
        return this.$store.state.app.local
      },
      messageCount () {
        return this.$store.getters.messageCount
      }
    },
    methods: {
      ...mapMutations([
        'setBreadCrumb',
        'setTagNavList',
        'addTag',
        'setLocal'
      ]),
      ...mapActions([
        'getUserInfo',
        'getUserMenu'
      ]),
      turnToPage (route) {
        let {name, params, query} = {}
        if (typeof route === 'string') name = route
        else {
          name = route.name
          params = route.params
          query = route.query
        }
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1])
          return
        }
        this.$router.push({
          name,
          params,
          query
        })
      },
      handleCollapsedChange (state) {
        this.collapsed = state
      },
      handleCloseTag (res, type, route) {
        let openName = ''
        if (type === 'all') {
          this.turnToPage('home')
          openName = 'home'
        } else if (routeEqual(this.$route, route)) {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
          if (type === 'other') openName = route.name
          else openName = nextRoute.name
        }
        this.setTagNavList(res)
        this.$refs.sideMenu.updateOpenName(openName)
      },
      handleClick (item) {
        this.turnToPage(item)
      }
    },
    watch: {
      '$route' (newRoute) {
        this.setBreadCrumb(newRoute.matched)
        this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      }
    },
    mounted () {
      /**
       * @description 初始化设置面包屑导航和标签导航
       */
      this.setTagNavList()
      this.addTag({
        route: this.$store.state.app.homeRoute
      })
      this.setBreadCrumb(this.$route.matched)
      // 保证完全挂载
      this.$nextTick(function () {
        // 获取用户菜单
        this.getUserMenu()
        // 获取用户信息
        this.getUserInfo()
      })
    }
  }
</script>
