import axios from '@/libs/api.request'

class system {
  // 获取数据字典项
  static getDictByCode (code) {
    return axios.request({
      url: '/sys/dict/find/' + code,
      method: 'get'
    })
  }

  // 获取一个资源详情
  static getResourceInfo (resId) {
    return axios.request({
      url: '/sys/resource/' + resId,
      method: 'get'
    })
  }

  // 获取一个权限详情
  static getPermissionInfo (permId) {
    return axios.request({
      url: '/sys/permission/' + permId,
      method: 'get'
    })
  }
}

export default system
