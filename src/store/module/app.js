import { getBreadCrumbList, setTagNavListInLocalstorage, getTagNavListFromLocalstorage, getHomeRoute } from '@/libs/util'
import routers from '@/router/routers'

export default {
  state: {
    clientHeight: document.documentElement.clientHeight,
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    messageCount: 10
  },
  getters: {
    // 获取菜单List
    /* menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access) */
    tagNavList (state) {
      return state.tagNavList
    },
    messageCount (state) {
      return state.messageCount
    },
    clientHeight (state) {
      return state.clientHeight
    }
  },
  mutations: {
    setClientHeight (state, height) {
      state.clientHeight = height
    },
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    addTag (state, item, type = 'unshift') {
      if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
        if (type === 'push') state.tagNavList.push(item)
        else state.tagNavList.unshift(item)
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setMessageCount (state, count) {
      state.messageCount = count
    }
  }
}
