import axios from '@/libs/api.request'

const jellyServer = `/calm-jelly`

class ResourceApi {
  // 资源管理树数据
  static reqResourceOperateTree () {
    return axios.request({
      url: `${jellyServer}/resource/operateTree`,
      method: 'get'
    })
  }

  // 资源管理分页查询
  static reqResourceListPage (method, params, data) {
    return axios.request({
      url: `${jellyServer}/resource/listPage`,
      method: method,
      data: data,
      params: params
    })
  }

  // 获取一个资源详情
  static reqResourceInfo (resId) {
    return axios.request({
      url: `${jellyServer}/resource/${resId}`,
      method: 'get'
    })
  }

  // 保存资源
  static reqResourceSave (data) {
    return axios.request({
      url: `${jellyServer}/resource`,
      method: 'post',
      data: data
    })
  }

  // 修改资源
  static reqResourceUpdate (data, resId) {
    return axios.request({
      url: `${jellyServer}/resource/${resId}`,
      method: 'put',
      data: data
    })
  }

  // 删除资源
  static reqResourceDelete (resId) {
    return axios.request({
      url: `${jellyServer}/resource/${resId}`,
      method: 'delete'
    })
  }

  // 资源树节点拖动
  static reqResourceDrop (type, resId, inResId) {
    return axios.request({
      url: `${jellyServer}/resource/drop/${type}/${resId}/${inResId}`,
      method: 'put'
    })
  }
}

export default ResourceApi
