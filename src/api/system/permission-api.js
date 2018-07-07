import axios from '@/libs/api.request'

class PermissionApi {
  // 获取授权树
  static reqPermissionAuthTree () {
    return axios.request({
      url: '/sys/permission/authTree',
      method: 'get'
    })
  }

  // 权限管理分页查询
  static reqPermissionListPage (method, params, data) {
    return axios.request({
      url: '/sys/permission/listPage',
      method: method,
      data: data,
      params: params
    })
  }

  // 获取一个权限详情
  static reqPermissionInfo (permId) {
    return axios.request({
      url: '/sys/permission/' + permId,
      method: 'get'
    })
  }

  // 保存权限
  static reqPermissionSave (data) {
    return axios.request({
      url: '/sys/permission',
      method: 'post',
      data: data
    })
  }

  // 修改权限
  static reqPermissionUpdate (data, permId) {
    return axios.request({
      url: '/sys/permission/' + permId,
      method: 'put',
      data: data
    })
  }

  // 删除权限
  static reqPermissionDelete (permId) {
    return axios.request({
      url: '/sys/permission/' + permId,
      method: 'delete'
    })
  }
}

export default PermissionApi
