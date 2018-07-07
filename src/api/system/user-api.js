import axios from '@/libs/api.request'

class UserApi {
  // 用户管理分页查询
  static reqUserListPage (method, params, data) {
    return axios.request({
      url: '/sys/user/listPage',
      method: method,
      data: data,
      params: params
    })
  }

  // 获取一个用户详情
  static reqUserInfo (resId) {
    return axios.request({
      url: '/sys/user/' + resId,
      method: 'get'
    })
  }

  // 保存用户
  static reqUserSave (data) {
    return axios.request({
      url: '/sys/user',
      method: 'post',
      data: data
    })
  }

  // 修改用户
  static reqUserUpdate (data, resId) {
    return axios.request({
      url: '/sys/user/' + resId,
      method: 'put',
      data: data
    })
  }

  // 删除用户
  static reqUserDelete (resId) {
    return axios.request({
      url: '/sys/user/' + resId,
      method: 'delete'
    })
  }
}

export default UserApi
