import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import data from './module/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    data
  }
})
