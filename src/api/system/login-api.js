import axios from '@/libs/api.request'

class LoginApi {
  // 用户登录
  static login ({userName, userpwd}) {
    return axios.request({
      url: 'login',
      data: {userName, userpwd},
      method: 'post'
    })
  }

  // 重新获取用户信息
  static reqUserInfo () {
    return axios.request({
      url: 'userInfo',
      method: 'get'
    })
  }

  // 获取用户菜单
  static reqUserMenu () {
    return axios.request({
      url: 'userMenu',
      method: 'get'
    })
  }

  // 获取用户权限
  static reqUserPerm () {
    return axios.request({
      url: 'userPerm',
      method: 'get'
    })
  }

  // 获取用户角色
  static reqUserRole () {
    return axios.request({
      url: 'userRole',
      method: 'get'
    })
  }

  static logout (token) {
    return axios.request({
      url: 'logout',
      method: 'put'
    })
  }
}

export default LoginApi
