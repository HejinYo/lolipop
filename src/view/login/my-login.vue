<template>
  <Row type="flex" justify="center" align="middle" class="login" @keydown.enter.native="submitLogin">
    <Col :xs="{span:22}" style="width: 368px;">
      <Row class="header">
        <img src="" width="220px"/>
        <div class="description">Lolipop 快速开发框架</div>
      </Row>

      <Alert type="error" v-if="message" show-icon>{{message}}</Alert>

      <Row class="login-form">
        <Tabs v-model="tabName">
          <TabPane label="账户密码登录" name="account" icon="person">
            <Form ref="accountForm" :model="form" :rules="rules" class="form">
              <FormItem prop="userName">
                <i-Input v-model="form.userName" size="large" clearable placeholder="请输入用户名">
                <span slot="prepend">
                   <Icon :size="16" type="md-person"></Icon>
                </span>
                </i-Input>
              </FormItem>
              <FormItem prop="userPwd">
                <i-Input type="password" v-model="form.userPwd" size="large" clearable placeholder="请输入密码">
                <span slot="prepend">
                    <Icon :size="16" type="md-lock"></Icon>
                </span>
                </i-Input>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="手机号登录" name="phone" icon="iphone">
            <Form ref="phoneForm" :model="form" :rules="rules" class="form">
              <FormItem prop="phone">
                <i-Input v-model="form.phone" size="large" clearable placeholder="请输入手机号">
                <span slot="prepend">
                       <Icon :size="16" type="ios-phone-portrait"></Icon>
                 </span>
                </i-Input>
              </FormItem>
              <FormItem prop="code" :error="errorCode">
                <Row type="flex" justify="space-between" class="code-row-bg">
                  <i-Input v-model="form.code" size="large" clearable placeholder="请输入短信验证码" :maxlength="maxLength" class="input-verify">
                  <span slot="prepend">
                     <Icon :size="16" type="md-mail"></Icon>
                   </span>
                  </i-Input>
                  <Button size="large" @click="sendVerify" v-if="!sended" class="send-verify">获取验证码</Button>
                  <Button size="large" disabled v-if="sended" class="count-verify">{{countButton}}</Button>
                </Row>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>

        <Row type="flex" justify="space-between" class="code-row-bg">
          <Checkbox v-model="saveLogin" size="large">自动登录</Checkbox>
          <a class="forget-pass" href="http://hejinyo.cn" target="_blank">忘记密码</a>
        </Row>
        <Row>
          <Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </Button>
        </Row>
        <Row type="flex" justify="space-between" class="code-row-bg other-login">
                    <span class="other-way">
                        其它方式登录
                        <icons type="QQ"/>
                        <icons type="wechat-fill"/>
                        <icons type="weibo"/>
                    </span>
          <!--<router-link to="/regist"><a class="forget-pass">注册账户</a></router-link>-->
          <a class="forget-pass" href="http://hejinyo.cn" target="_blank">注册账户</a>
        </Row>
      </Row>

      <Row class="foot">
        <Row type="flex" justify="space-around" class="code-row-bg help">
          <a class="item">帮助</a>
          <a class="item">隐私</a>
          <a class="item">条款</a>
        </Row>
        <Row type="flex" justify="center" class="code-row-bg copyright">
          Copyright © 2018 <a href="http://hejinyo.cn" target="_blank" style="margin:0 5px;">HejinYo</a> Presents 京ICP证17056403号
        </Row>
      </Row>
    </Col>
  </Row>
</template>

<script>
  import {mapActions} from 'vuex'
  import {validatePhone} from '@/libs/validate'
  import LoginApi from '@/api/system/login-api'

  export default {
    data () {
      return {
        // 登录消息结果
        message: null,
        // table页当前名称
        tabName: 'account',
        // 自动登录
        saveLogin: true,
        // 点击登录加载
        loading: false,
        // 发送验证码标识
        sended: false,
        // 倒计时时间
        count: 60,
        // 倒计时显示时间
        countButton: '60 s',
        // 短信验证码长度
        maxLength: 6,
        // 验证码失败信息
        errorCode: '',
        form: {
          userName: '',
          userPwd: '',
          phone: '',
          code: ''
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          userPwd: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      ...mapActions([
        'handleLogin'
      ]),
      // 发送验证码
      sendVerify () {
        this.$refs.phoneForm.validate(valid => {
          if (valid) {
            // 发送验证请求
            LoginApi.reqSendLoginCode(this.form.phone).then(data => {
              let {code, msg} = data
              if (code === 0) {
                this.sended = true
                this.countDown()
              } else {
                this.message = msg
              }
            })
          }
        })
      },
      //  验证码倒计时
      countDown () {
        let that = this
        if (this.count === 0) {
          this.sended = false
          this.count = 60
          return
        } else {
          this.countButton = this.count + ' s'
          this.count--
        }
        setTimeout(function () {
          that.countDown()
        }, 1000)
      },
      // 执行登录
      submitLogin () {
        if (this.tabName === 'account') {
          this.$refs.accountForm.validate(valid => {
            if (valid) {
              this.loading = true
              this.handleLogin({userName: this.form.userName, userPwd: this.form.userPwd}).then(data => {
                let {code, msg, result} = data
                if (code === 0) {
                  this.message = null
                  // 设置Token
                  this.$store.commit('setToken', result)
                  this.$router.push({name: 'home'})
                } else {
                  this.message = msg
                  this.loading = false
                }
              })
            }
          })
        } else if (this.tabName === 'phone') {
          this.$refs.phoneForm.validate(valid => {
            if (valid) {
              if (this.form.code === '') {
                this.errorCode = '验证码不能为空'
                return
              } else {
                this.errorCode = ''
              }
              LoginApi.phoneLogin({phone: this.form.phone, code: this.form.code}).then(data => {
                let {code, msg, result} = data
                if (code === 0) {
                  this.message = null
                  // 设置Token
                  this.$store.commit('setToken', result)
                  this.$router.push({name: 'home'})
                } else {
                  this.message = msg
                  this.loading = false
                }
              })
              // this.$Message.error('页面演示，暂不支持短信登录')
            }
          })
        }
      }
    }
  }
</script>

<style lang="less">
  .login {
    height: 100vh;
    background: url('../../assets/images/background.svg');
    .header {
      margin-top: 9vh;
      margin-bottom: 6vh;
      text-align: center;
      .description {
        font-size: 30px;
        color: rgba(0, 0, 0, .45);
        margin-top: 1vh;
      }
    }
    .login-form {
      margin-bottom: 16vh;
    }
    .ivu-tabs-nav-container {
      line-height: 2;
      font-size: 17px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
      zoom: 1;
    }
    .form {
      padding-top: 1vh;
      .input-verify {
        width: 70%;
      }
      .count-verify, .send-verify {
        width: 100px;
      }
    }
    .forget-pass, .other-way {
      font-size: 14px;
    }
    .login-btn, .other-login {
      margin-top: 3vh;
    }
    .other-icon {
      cursor: pointer;
      margin-left: 10px;
      margin-bottom: -4px;
      color: rgba(0, 0, 0, .2);
      :hover {
        color: #2d8cf0;
      }
    }
    .lower {
      margin-bottom: -6px;
    }
    .foot {
      margin-bottom: 2vh;
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
      .help {
        margin: 0 auto;
        margin-bottom: 1vh;
        width: 60%;
        .item {
          color: rgba(0, 0, 0, .45);
        }
        :hover {
          color: rgba(0, 0, 0, .65);
        }
      }
    }

  }
</style>
