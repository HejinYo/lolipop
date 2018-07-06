import axios from '@/libs/api.request'

class DeptApi {
  // 部门管理树数据
  static reqDeptOperateTree () {
    return axios.request({
      url: '/sys/dept/operateTree',
      method: 'get'
    })
  }

  // 部门管理分页查询
  static reqDeptListPage (method, params, data) {
    return axios.request({
      url: '/sys/dept/listPage',
      method: method,
      data: data,
      params: params
    })
  }

  // 获取一个部门详情
  static reqDeptInfo (resId) {
    return axios.request({
      url: '/sys/dept/' + resId,
      method: 'get'
    })
  }

  // 保存部门
  static reqDeptSave (data) {
    return axios.request({
      url: '/sys/dept',
      method: 'post',
      data: data
    })
  }

  // 修改部门
  static reqDeptUpdate (data, resId) {
    return axios.request({
      url: '/sys/dept/' + resId,
      method: 'put',
      data: data
    })
  }

  // 删除部门
  static reqDeptDelete (resId) {
    return axios.request({
      url: '/sys/dept/' + resId,
      method: 'delete'
    })
  }

  // 部门树节点拖动
  static reqDeptDrop (type, resId, inResId) {
    return axios.request({
      url: '/sys/dept/drop/' + type + '/' + resId + '/' + inResId,
      method: 'put'
    })
  }
}

export default DeptApi
