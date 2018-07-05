import axios from '@/libs/api.request'

class DictApi {
  // 获取数据字典项
  static getDictByCode (code) {
    return axios.request({
      url: '/sys/dict/find/' + code,
      method: 'get'
    })
  }
}

export default DictApi
