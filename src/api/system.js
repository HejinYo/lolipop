import axios from '@/libs/api.request'

class system {
  // 获取数据字典项
  static getDictByCode (code) {
    return axios.request({
      url: '/sys/dict/find/' + code,
      method: 'get'
    })
  }

  // 资源管理树数据
  static reqResourceOperateTree () {
    return axios.request({
      url: '/sys/resource/operateTree',
      method: 'get'
    })
  }

  // 资源管理分页查询
  static reqResourceListPage (method, params, data) {
    return axios.request({
      url: '/sys/resource/listPage',
      method: method,
      data: data,
      params: params
    })
  }

  // 权限管理分页查询
  static reqRermissionListPage (method, params, data) {
    return axios.request({
      url: '/sys/permission/listPage',
      method: method,
      data: data,
      params: params
    })
  }

  // 获取一个资源详情
  static reqResourceInfo (resId) {
    return axios.request({
      url: '/sys/resource/' + resId,
      method: 'get'
    })
  }

  // 保存资源
  static reqResourceSave (data) {
    return axios.request({
      url: '/sys/resource',
      method: 'post',
      data: data
    })
  }

  // 修改资源
  static reqResourceUpdate (data, resId) {
    return axios.request({
      url: '/sys/resource/' + resId,
      method: 'put',
      data: data
    })
  }

  // 删除资源
  static reqResourceDelete (resId) {
    return axios.request({
      url: '/sys/resource/' + resId,
      method: 'delete'
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

export default system
