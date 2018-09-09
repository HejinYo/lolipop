import axios from '@/libs/api.request'

const jellyServer = '/calm-jelly'

class ConfigApi {
  // 配置分页查询
  static reqConfigListPage (method, params, data) {
    return axios.request({
      url: `${jellyServer}/config/listPage`,
      method: method,
      params: params,
      data: data
    })
  }

  // 获取一个系统配置详情
  static reqConfigInfo (id) {
    return axios.request({
      url: `${jellyServer}/config/${id}`,
      method: `get`
    })
  }

  // 保存系统配置
  static reqConfigSave (data) {
    return axios.request({
      url: `${jellyServer}/config`,
      method: `post`,
      data: data
    })
  }

  // 修改系统配置
  static reqConfigUpdate (id, data) {
    return axios.request({
      url: `${jellyServer}/config/${id}`,
      method: `put`,
      data: data
    })
  }

  // 更新配置选项
  static reqConfigUpdateOptionId (id, optionId) {
    return axios.request({
      url: `${jellyServer}/config/${id}/${optionId}`,
      method: `put`
    })
  }

  // 删除系统配置
  static reqConfigDelete (id) {
    return axios.request({
      url: `${jellyServer}/config/${id}`,
      method: `delete`
    })
  }

  /******************/

  // 根据配置code获取配置值列表
  static reqOptionList (code) {
    return axios.request({
      url: `${jellyServer}/config/option/${code}`,
      method: `get`
    })
  }

  // 保存系统配置属性
  static reqOptionSave (data) {
    return axios.request({
      url: `${jellyServer}/config/option`,
      method: `post`,
      data: data
    })
  }

  // 修改系统配置属性
  static reqOptionUpdate (configId, data) {
    return axios.request({
      url: `${jellyServer}/config/option/${configId}`,
      method: `put`,
      data: data
    })
  }

  // 删除系统配置属性
  static reqOptionDelete (configId) {
    return axios.request({
      url: `${jellyServer}/config/option/${configId}`,
      method: `delete`
    })
  }

  // 系统配置属性树节点拖动
  static reqOptionDrop (type, configId, inResId) {
    return axios.request({
      url: `${jellyServer}/config/option/drop/${type}/${configId}/${inResId}`,
      method: `put`
    })
  }
}

export default ConfigApi
