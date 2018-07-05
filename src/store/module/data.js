import DictApi from '@/api/system/dict-api'

const data = {
  state: {
    // 数据字典
    dictData: {}
  },
  // 相当于计算属性，可以自定义state所相关的属性，比如取反
  getters: {},
  mutations: {
    setDictData (state, {dictCode, result}) {
      state.dictData[dictCode] = result
    }
  },
  actions: {
    // refresh: true 每次都去服务器获取， false:如果存在，则用内存中的
    // 获取数据字典项
    loadDictData: async ({state, commit}, dictCode, refresh) => {
      const setDictData = await new Promise(function (resolve, reject) {
        if (state.dictData[dictCode] === undefined || refresh) {
          DictApi.getDictByCode(dictCode).then(data => {
            let {code, result} = data
            if (code === 0) {
              commit('setDictData', {dictCode: dictCode, result: result})
              resolve(result)
            } else {
              resolve([])
            }
          })
        } else {
          resolve(state.dictData[dictCode])
        }
      })
      return setDictData
    }
  }
}

export default data
