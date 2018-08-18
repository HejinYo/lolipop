import { getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute, routeHasExist } from '@/libs/util'
import routers from '@/router/routers'

export default {
  state: {
    clientHeight: document.documentElement.clientHeight,
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    messageCount: 10,
    local: ''
  },
  getters: {
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
    addTag (state, {route, type = 'unshift'}) {
      if (!routeHasExist(state.tagNavList, route)) {
        if (type === 'push') state.tagNavList.push(route)
        else {
          if (route.name === 'home') state.tagNavList.unshift(route)
          else state.tagNavList.splice(1, 0, route)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setMessageCount (state, count) {
      state.messageCount = count
    },
    setLocal (state, lang) {
      state.local = lang
    }
  }
}
