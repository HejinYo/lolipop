import axios from '@/libs/api.request'

const authServer = `/calm-auth`
const jellyServer = `/calm-jelly`

class LoginApi {
  // 用户登录
  static login ({userName, userPwd}) {
    return axios.request({
      url: `${authServer}/jelly/login`,
      data: {userName, userPwd},
      method: 'post'
    })
  }

  // 发送登录验证码
  static reqSendLoginCode (phone) {
    return axios.request({
      url: `${authServer}/jelly/login/code/${phone}`,
      method: 'post'
    })
  }

  // 手机登录
  static phoneLogin ({phone, code}) {
    return axios.request({
      url: `${authServer}/jelly/login/phone`,
      data: {phone, code},
      method: 'post'
    })
  }

  // 重新获取用户信息
  static reqUserInfo () {
    return axios.request({
      url: `${jellyServer}/userInfo`,
      method: 'get'
    })
  }

  // 获取用户菜单
  static reqUserMenu () {
    return axios.request({
      url: `${jellyServer}/userMenu`,
      method: 'get'
    })
  }

  // 获取用户权限
  static reqUserPerm () {
    return axios.request({
      url: `${jellyServer}/userPerm`,
      method: 'get'
    })
  }

  // 获取用户角色
  static reqUserRole () {
    return axios.request({
      url: `${jellyServer}/userRole`,
      method: 'get'
    })
  }

  static logout (token) {
    return axios.request({
      url: `${authServer}/jelly/logout`,
      method: 'put'
    })
  }

  static oauthLogin () {
    return axios.request({
      url: `${authServer}/jelly/login/qq`,
      method: 'get'
    })
  }
}

export default LoginApi
