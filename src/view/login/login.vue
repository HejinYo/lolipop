<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <Alert type="error" v-if="message" show-icon>{{message}}</Alert>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import LoginForm from '@/components/login-form'
  import { mapActions } from 'vuex'

  export default {
    components: {
      LoginForm
    },
    data () {
      return {
        message: null
      }
    },
    methods: {
      ...mapActions([
        'handleLogin'
      ]),
      handleSubmit ({userName, userpwd}) {
        this.handleLogin({userName, userpwd}).then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.message = null
            // 设置Token
            this.$store.commit('setToken', result)
            this.$router.push({name: 'home'})
          } else {
            this.message = msg
          }
        })
      }
    }
  }
</script>

<style>

</style>
