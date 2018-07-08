import axios from '@/libs/api.request'

class DictApi {
  // 获取数据字典项
  static getDictByCode (code) {
    return axios.request({
      url: '/sys/dict/find/' + code,
      method: 'get'
    })
  }

  // 字典字典目录列表数据
  static reqDictOperateTree () {
    return axios.request({
      url: '/sys/dict/list',
      method: 'get'
    })
  }

  // 获取一个字典目录详情
  static reqDictInfo (id) {
    return axios.request({
      url: '/sys/dict/' + id,
      method: 'get'
    })
  }

  // 保存字典目录
  static reqDictSave (data) {
    return axios.request({
      url: '/sys/dict',
      method: 'post',
      data: data
    })
  }

  // 修改字典目录
  static reqDictUpdate (data, id) {
    return axios.request({
      url: '/sys/dict/' + id,
      method: 'put',
      data: data
    })
  }

  // 删除字典目录
  static reqDictDelete (id) {
    return axios.request({
      url: '/sys/dict/' + id,
      method: 'delete'
    })
  }

  /******************/

  // 字典配置管理分页查询
  static reqOptionListPage (method, params, data) {
    return axios.request({
      url: '/sys/dict/option/listPage',
      method: method,
      data: data,
      params: params
    })
  }

  // 获取一个字典配置详情
  static reqOptionInfo (dictId) {
    return axios.request({
      url: '/sys/dict/option/' + dictId,
      method: 'get'
    })
  }

  // 保存字典配置
  static reqOptionSave (data) {
    return axios.request({
      url: '/sys/dict/option',
      method: 'post',
      data: data
    })
  }

  // 修改字典配置
  static reqOptionUpdate (data, dictId) {
    return axios.request({
      url: '/sys/dict/option/' + dictId,
      method: 'put',
      data: data
    })
  }

  // 删除字典配置
  static reqOptionDelete (dictId) {
    return axios.request({
      url: '/sys/dict/option/' + dictId,
      method: 'delete'
    })
  }

  // 字典配置树节点拖动
  static reqOptionDrop (type, dictId, inResId) {
    return axios.request({
      url: '/sys/dict/option/drop/' + type + '/' + dictId + '/' + inResId,
      method: 'put'
    })
  }
}

export default DictApi
