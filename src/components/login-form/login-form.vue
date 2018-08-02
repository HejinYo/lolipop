<template>
  <div @keydown.enter="handleSubmit">
    <Form ref="loginForm" :model="form" :rules="rules">
      <FormItem prop="userName">
        <Input v-model="form.userName" placeholder="请输入用户名">
          <span slot="prepend">
            <Icon :size="16" type="md-person"></Icon>
          </span>
        </Input>
      </FormItem>
      <FormItem prop="userpwd">
        <Input type="password" v-model="form.userpwd" placeholder="请输入密码">
          <span slot="prepend">
            <Icon :size="14" type="md-lock"></Icon>
          </span>
        </Input>
      </FormItem>
      <FormItem>
        <Button @click="handleSubmit" type="primary" long>登录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        userpwd: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        userpwd: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            userpwd: this.form.userpwd
          })
        }
      })
    }
  }
}
</script>
