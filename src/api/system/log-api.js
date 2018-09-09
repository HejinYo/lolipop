import axios from '@/libs/api.request'

const jellyServer = `/calm-jelly`

class LogApi {
  // 日志管理分页查询
  static reqLogListPage (method, params, data) {
    return axios.request({
      url: `${jellyServer}/log/listPage`,
      method: method,
      params: params,
      data: data
    })
  }
}

export default LogApi
