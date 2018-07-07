import LoginApi from '@/api/system/login-api'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    // 登录用户详细信息
    loginUser: {},
    // 用户名
    userName: '',
    // 用户白那后
    userId: '',
    // 用户头像地址
    avatorImgPath: '',
    // 用户token
    token: getToken(),
    // 用户权限列表
    access: '',
    // 用户菜单列表
    menuList: []
  },
  mutations: {
    setLoginUser (state, data) {
      state.loginUser = data
    },
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setMenuList (state, data) {
      state.menuList = data
    }
  },
  getters: {
    // 获取菜单List
    menuList: (state, getters, rootState) => state.menuList,
    // 用户信息
    loginUser: (state) => state.loginUser
  },
  actions: {
    // 登录
    handleLogin ({commit}, {userName, userpwd}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        LoginApi.login({userName, userpwd}).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({state, commit}) {
      return new Promise((resolve, reject) => {
        LoginApi.logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({state, commit}) {
      return new Promise((resolve, reject) => {
        LoginApi.reqUserInfo().then(data => {
          let {result} = data
          commit('setAvator', result.avatar)
          commit('setUserName', result.nickName)
          commit('setUserId', result.userId)
          commit('setLoginUser', result)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户权限
    getUserPerm ({state, commit}, refresh) {
      return new Promise((resolve, reject) => {
        // 是否从缓存获取
        if (state.access.length === 0 || refresh) {
          LoginApi.reqUserPerm().then(data => {
            let {code, result} = data
            if (code === 0) {
              commit('setAccess', result)
              resolve(result)
            } else {
              resolve([])
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          resolve(state.access)
        }
      })
    },
    // 获取用户左侧菜单
    getUserMenu ({state, commit}) {
      return new Promise((resolve, reject) => {
        LoginApi.reqUserMenu().then(data => {
          let {code, result} = data
          if (code === 0) {
            commit('setMenuList', result)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
