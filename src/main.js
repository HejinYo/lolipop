// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import config from '@/config'
import importDirective from '@/directive'
import 'iview/dist/styles/iview.css'
import '@/assets/icons/iconfont.css'
import { Tree, Checkbox, Table, TableColumn, Loading } from 'element-ui'
import PermCheck from '@/libs/perm-check'

// require('@/mock')

Vue.use(iView)
Vue.config.productionTip = false
/**
 * 注册全局权限检查
 */
Vue.prototype.PermCheck = PermCheck
/**
 * 全局注册应用配置config
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.use(Tree)
Vue.use(Checkbox)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Loading.directive)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data: {
    onresizeFlag: true
  },
  mounted () {
    this.$nextTick(function () {
      let _this = this
      // 保证完全挂载
      window.onresize = function temp () {
        if (_this.onresizeFlag) {
          _this.onresizeFlag = false
          let height = document.documentElement.clientHeight
          store.commit('setClientHeight', height)
          setTimeout(function () {
            _this.onresizeFlag = true
          }, 30)
        }
      }
    })
  }
})
