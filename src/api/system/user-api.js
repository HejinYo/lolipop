import axios from '@/libs/api.request'

const jellyServer = `/calm-jelly`

class UserApi {
  // 用户管理分页查询
  static reqUserListPage (method, params, data) {
    return axios.request({
      url: `${jellyServer}/user/listPage`,
      method: method,
      data: data,
      params: params
    })
  }

  // 获取一个用户详情
  static reqUserInfo (userId) {
    return axios.request({
      url: `${jellyServer}/user/${userId}`,
      method: 'get'
    })
  }

  // 保存用户
  static reqUserSave (data) {
    return axios.request({
      url: `${jellyServer}/user`,
      method: 'post',
      data: data
    })
  }

  // 修改用户
  static reqUserUpdate (data, userId) {
    return axios.request({
      url: `${jellyServer}/user/${userId}`,
      method: 'put',
      data: data
    })
  }

  // 删除用户
  static reqUserDelete (userId) {
    return axios.request({
      url: `${jellyServer}/user/${userId}`,
      method: 'delete'
    })
  }
}

export default UserApi
