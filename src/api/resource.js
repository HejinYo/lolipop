import axios from '@/libs/api.request'

// 资源管理树数据
export const reqResourceOperateTree = () => {
  return axios.request({
    url: '/sys/resource/operateTree',
    method: 'get'
  })
}
