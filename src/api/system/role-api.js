import axios from '@/libs/api.request'

class RoleApi {
  // 角色列表下拉选择
  static reqRoleDrop () {
    return axios.request({
      url: '/sys/role/drop',
      method: 'get'
    })
  }

  // 角色管理分页查询
  static reqRoleListPage (method, params, data) {
    return axios.request({
      url: '/sys/role/listPage',
      method: method,
      data: data,
      params: params
    })
  }

  // 获取一个角色详情
  static reqRoleInfo (roleId) {
    return axios.request({
      url: '/sys/role/' + roleId,
      method: 'get'
    })
  }

  // 保存角色
  static reqRoleSave (data) {
    return axios.request({
      url: '/sys/role',
      method: 'post',
      data: data
    })
  }

  // 修改角色
  static reqRoleUpdate (data, roleId) {
    return axios.request({
      url: '/sys/role/' + roleId,
      method: 'put',
      data: data
    })
  }

  // 删除角色
  static reqRoleDelete (roleId) {
    return axios.request({
      url: '/sys/role/' + roleId,
      method: 'delete'
    })
  }
}

export default RoleApi
