import Axios from 'axios'
import { Message, Notice } from 'iview'
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'
// 全局的baseUrl
const baseURL = '/api'

class httpRequest {
  constructor () {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
  }

  // 销毁请求实例
  destroy (url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }

  // 请求拦截
  interceptors (instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      // if (!config.url.includes('/users')) {
      config.headers['x-access-token'] = Cookies.get(TOKEN_KEY)
      // }
      // Spin.show()
      // 在发送请求之前做些什么
      if (config.method === 'get') {
        config.params = {
          _t: Date.parse(new Date()) / 1000,
          ...config.params
        }
      }
      return config
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error)
    })

    // 添加响应拦截器
    instance.interceptors.response.use((res) => {
      let {data} = res
      const is = this.destroy(url)
      if (!is) {
        setTimeout(() => {
          // Spin.hide()
        }, 500)
      }
      if (!(data instanceof Blob)) {
        /* if (data.code !== 200) {
          // 后端服务在个别情况下回报201，待确认
          if (data.code === 401) {
            Cookies.remove(TOKEN_KEY)
            window.location.href = '/#/login'
            Message.error('未登录，或登录失效，请登录')
          } else {
            if (data.msg) Message.error(data.msg)
          }
          return false
        } */
        // token 已过期，重定向到登录页面
        let code = data.code
        Notice.destroy('authc_error')
        if (code === 1130 || code === 1132) {
          Cookies.remove(TOKEN_KEY)
          Notice.info({
            title: '温馨提示',
            desc: data.msg,
            duration: 0,
            name: 'authc_error'
          })
          setTimeout(() => {
            window.location.href = window.location.pathname + '#/login'
          }, 2000)
          // 返回reject阻拦本次请求，会报错，但是没办法userName.trim()
          return Promise.reject(data.msg)
        } else {
          return data
        }
      }
      return data
    }, (error) => {
      if (error.response) {
        let message = error.response.data.msg
        switch (error.response.status) {
          case 401:
            Message.warning({
              content: message
            })
            break
          case 500:
            Message.warning({
              content: message
            })
            break
          case 504:
            Message.warning({
              content: '网络连接超时'
            })
            break
          default:
            Message.warning({
              content: '服务器繁忙，请稍候再试'
            })
        }
      }
      return Promise.reject(error)
    })
  }

  // 创建实例
  create () {
    let conf = {
      baseURL: baseURL,
      // timeout: 2000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-URL-PATH': location.pathname
      }
    }
    return Axios.create(conf)
  }

  // 合并请求实例
  mergeReqest (instances = []) {
    //
  }

  // 请求实例
  request (options) {
    let instance = this.create()
    this.interceptors(instance, options.url)
    options = Object.assign({}, options)
    this.queue[options.url] = instance
    return instance(options)
  }
}

export default httpRequest
