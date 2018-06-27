import axios from '@/libs/api.request'

// 用户登录
export const login = ({userName, userpwd}) => {
  const data = {
    userName,
    userpwd
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}
// 重新获取用户信息
export const reqUserInfo = () => {
  return axios.request({
    url: 'userInfo',
    method: 'get'
  })
}

// 获取用户菜单
export const reqUserMenu = () => {
  return axios.request({
    url: 'userMenu',
    method: 'get'
  })
}

// 获取用户权限
export const reqUserPerm = () => {
  return axios.request({
    url: 'userPerm',
    method: 'get'
  })
}

// 获取用户角色
export const reqUserRole = () => {
  return axios.request({
    url: 'userRole',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
