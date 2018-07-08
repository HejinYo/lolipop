import axios from '@/libs/api.request'

class DeptApi {
  // 部门选择树数据
  static reqDeptSelect () {
    return axios.request({
      url: '/sys/dept/select',
      method: 'get'
    })
  }

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
  static reqDeptInfo (deptId) {
    return axios.request({
      url: '/sys/dept/' + deptId,
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
  static reqDeptUpdate (data, deptId) {
    return axios.request({
      url: '/sys/dept/' + deptId,
      method: 'put',
      data: data
    })
  }

  // 删除部门
  static reqDeptDelete (deptId) {
    return axios.request({
      url: '/sys/dept/' + deptId,
      method: 'delete'
    })
  }

  // 部门树节点拖动
  static reqDeptDrop (type, deptId, inResId) {
    return axios.request({
      url: '/sys/dept/drop/' + type + '/' + deptId + '/' + inResId,
      method: 'put'
    })
  }
}

export default DeptApi
