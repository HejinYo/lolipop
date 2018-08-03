<style lang="less">
  @import './own-space.less';
  @import './image-editor.less';
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        个人信息
      </p>
      <div>
        <Form ref="currUser" :model="currUser" :label-width="100" label-position="right" :rules="inforValidate">
          <FormItem label="头像：">
            <a @click="initAvatar">
              <Avatar :src="currUser.avatar" shape="square" size="large"></Avatar>
            </a>
          </FormItem>
          <FormItem label="用户名：" prop="userName">
            <div style="display:inline-block;width:300px;">
              <Input v-model="currUser.userName"></Input>
            </div>
          </FormItem>
          <FormItem label="手机：" prop="phone">
            <div style="display:inline-block;width:204px;">
              <Input v-model="currUser.phone" @on-keydown="hasChangePhone"></Input>
            </div>
            <div style="display:inline-block;position:relative;">
              <Button @click="getIdentifyCode" :disabled="canGetIdentifyCode">{{ gettingIdentifyCodeBtnContent }}</Button>
              <div class="own-space-input-identifycode-con" v-if="inputCodeVisible">
                <div style="background-color:white;z-index:110;margin:10px;">
                  <Input v-model="securityCode" placeholder="请填写短信验证码"></Input>
                  <div style="margin-top:10px;text-align:right">
                    <Button type="ghost" @click="cancelInputCodeBox">取消</Button>
                    <Button type="primary" @click="submitCode" :loading="checkIdentifyCodeLoading">确定</Button>
                  </div>
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem label="邮箱：" prop="email">
            <div style="display:inline-block;width:300px;">
              <Input v-model="currUser.email"></Input>
            </div>
          </FormItem>
          <!-- <FormItem label="公司：">
             <span>{{ currUser.company }}</span>
           </FormItem>
           <FormItem label="部门：">
             <span>{{ currUser.department }}</span>
           </FormItem>-->
          <FormItem label="登录密码：">
            <Button type="text" size="small" @click="editPasswordModal = true">修改密码</Button>
          </FormItem>
          <div>
            <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
            <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
          </div>
        </Form>
      </div>
    </Card>
    <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
      <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
        <FormItem label="原密码" prop="oldPass" :error="oldPassError">
          <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPass">
          <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符"></Input>
        </FormItem>
        <FormItem label="确认新密码" prop="rePass">
          <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="editPasswordModal = false">取消</Button>
        <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
      </div>
    </Modal>

    <Modal v-model="avatarModal" :mask-closable=false>
      <p slot="header">头像设置</p>
      <div class="image-editor">
        <Row :gutter="10">
          <Col span="14" class="image-editor-con1">
            <div class="cropper">
              <img id="avatarImg" alt="" :src="currUser.avatar">
            </div>
          </Col>
          <Col span="10" class="image-editor-con1">
            <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
              <div id="preview1"></div>
            </Row>
            <div class="image-editor-con1-btn-con margin-top-10">
              <div class="margin-top-10" style="text-align: center;">
                <ButtonGroup>
                  <Button @click="avatarCropper.rotate(-90)" type="text">
                    <Icon :size="14" type="arrow-return-left"></Icon>
                  </Button>
                  <Button @click="avatarCropper.rotate(90)" type="text">
                    <Icon :size="14" type="arrow-return-right"></Icon>
                  </Button>
                  <Button @click="avatarCropper.scaleX(-avatarCropper.getData().scaleX)" type="text">
                    <Icon :size="14" type="android-more-horizontal"></Icon>
                  </Button>
                  <Button @click="avatarCropper.scaleY(-avatarCropper.getData().scaleY)" type="text">
                    <Icon :size="14" type="android-more-vertical"></Icon>
                  </Button>
                </ButtonGroup>
              </div>
              <div class="margin-top-20" style="text-align: center;">
                <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange" id="avatarInput" class="fileinput"/>
                <label class="filelabel" style="width: 100%" for="avatarInput">
                  <Icon type="image"></Icon>&nbsp;选择图片</label>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="destroyAvatar">取 消</Button>
        <Button type="primary" @click="handleCrop">确 定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Cropper from 'cropperjs'
  import 'cropperjs/dist/cropper.min.css'
  import { validatePhone } from '@/libs/validate'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { getNextName } from '@/libs/util'

  export default {
    name: 'ownspace_index',
    data () {
      const valideRePassword = (rule, value, callback) => {
        if (value !== this.editPasswordForm.newPass) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        currUser: {
          userName: null,
          userPwd: null,
          email: null,
          phone: null,
          roleId: null,
          roleName: null,
          state: 0
        },
        securityCode: '', // 验证码
        phoneHasChanged: false, // 是否编辑了手机
        save_loading: false,
        identifyError: '', // 验证码错误
        editPasswordModal: false, // 修改密码模态框显示
        savePassLoading: false,
        oldPassError: '',
        identifyCodeRight: false, // 验证码是否正确
        hasGetIdentifyCode: false, // 是否点了获取验证码
        canGetIdentifyCode: false, // 是否可点获取验证码
        checkIdentifyCodeLoading: false,
        inforValidate: {
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号码'},
            {validator: validatePhone}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
          ]
        },
        editPasswordForm: {
          oldPass: '',
          newPass: '',
          rePass: ''
        },
        passwordValidate: {
          oldPass: [
            {required: true, message: '请输入原密码', trigger: 'blur'}
          ],
          newPass: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, message: '请至少输入6个字符', trigger: 'blur'},
            {max: 32, message: '最多输入32个字符', trigger: 'blur'}
          ],
          rePass: [
            {required: true, message: '请再次输入新密码', trigger: 'blur'},
            {validator: valideRePassword, trigger: 'blur'}
          ]
        },
        inputCodeVisible: false, // 显示填写验证码box
        initPhone: '',
        gettingIdentifyCodeBtnContent: '获取验证码', // “获取验证码”按钮的文字
        avatarModal: false,
        avatarCropper: {}
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.refreshUserInfo()
      })
    },
    computed: {
      ...mapGetters([
        'tagNavList'
      ])
    },
    methods: {
      ...mapMutations([
        'setTagNavList'
      ]),
      ...mapActions([
        'getUserInfo',
        'getUserMenu'
      ]),
      // 获取用户信息
      refreshUserInfo () {
        this.getUserInfo().then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.currUser = result
          } else {
            this.$Message.warning(msg)
          }
        })
      },
      // 获取验证码
      getIdentifyCode () {
        this.hasGetIdentifyCode = true
        this.$refs['currUser'].validate((valid) => {
          if (valid) {
            this.canGetIdentifyCode = true
            let timeLast = 60
            let timer = setInterval(() => {
              if (timeLast >= 0) {
                this.gettingIdentifyCodeBtnContent = timeLast + '秒后重试'
                timeLast -= 1
              } else {
                clearInterval(timer)
                this.gettingIdentifyCodeBtnContent = '获取验证码'
                this.canGetIdentifyCode = false
              }
            }, 1000)
            this.inputCodeVisible = true
            // you can write ajax request here
          }
        })
      },
      // 取消编辑用户信息
      cancelEditUserInfor () {
        let res = this.tagNavList.filter(item => item.name !== 'ownspace')
        const nextName = getNextName(this.tagNavList, 'ownspace')
        this.setTagNavList(res)
        this.$router.push({name: nextName})
      },
      // 保存用户信息
      saveEdit () {
        this.$refs['currUser'].validate((valid) => {
          if (valid) {
            if (this.phoneHasChanged && this.currUser.phone !== this.initPhone) { // 手机号码修改过了而且修改之后的手机号和原来的不一样
              if (this.hasGetIdentifyCode) { // 判断是否点了获取验证码
                if (this.identifyCodeRight) { // 判断验证码是否正确
                  this.saveInfoAjax()
                } else {
                  this.$Message.error('验证码错误，请重新输入')
                }
              } else {
                this.$Message.warning('请先点击获取验证码')
              }
            } else {
              this.saveInfoAjax()
            }
          }
        })
      },
      // 执行修改密码
      saveEditPass () {
        this.$refs['editPasswordForm'].validate((valid) => {
          if (valid) {
            this.savePassLoading = true
            this.$http.put('/api/user/updatePassword', this.editPasswordForm)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('修改成功！')
                  this.editPasswordModal = false
                } else {
                  this.$Message.warning(response.data.msg)
                }
                this.savePassLoading = false
              })
          }
        })
      },
      cancelInputCodeBox () {
        this.inputCodeVisible = false
        this.currUser.phone = this.initPhone
      },
      submitCode () {
        let vm = this
        vm.checkIdentifyCodeLoading = true
        if (this.securityCode.length === 0) {
          this.$Message.error('请填写短信验证码')
        } else {
          setTimeout(() => {
            this.$Message.success('验证码正确')
            this.inputCodeVisible = false
            this.checkIdentifyCodeLoading = false
          }, 1000)
        }
      },
      hasChangePhone () {
        this.phoneHasChanged = true
        this.hasGetIdentifyCode = false
        this.identifyCodeRight = false
      },
      // 保存用户信息
      saveInfoAjax () {
        this.$refs['currUser'].validate((valid) => {
          if (valid) {
            this.save_loading = true
            this.$http.put('/api/user/updateUserInfo', this.currUser)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('修改成功！')
                  this.getUserInfo()
                } else {
                  this.$Message.warning(response.data.msg)
                }
                this.save_loading = false
              })
          }
        })
      },
      // 初始化图片剪切
      initAvatar () {
        this.avatarModal = !this.avatarModal
        let img1 = document.getElementById('avatarImg')
        this.avatarCropper = new Cropper(img1, {
          viewMode: 1, // 裁剪框 只能在图片内移动
          dragMode: 'none', // 图片就不能拖动
          aspectRatio: 1, // 剪切比例
          preview: '#preview1', // 截图的显示位置,
          zoomable: false, // 是否允许缩放图片
          checkCrossOrigin: false //跨域检查
        })
      },
      // 销毁图片剪切
      destroyAvatar () {
        this.avatarModal = !this.avatarModal
        setTimeout(() => {
          this.avatarCropper.destroy()
        }, 300)
      },
      handleChange (e) {
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.onload = () => {
          this.avatarCropper.replace(reader.result)
          reader.onload = null
        }
        reader.readAsDataURL(file)
      },
      // 保存头像
      handleCrop: function () {
        this.avatarCropper.getCroppedCanvas().toBlob(avatar => {
          // 创建form对象
          let param = new FormData()
          // 通过append向form对象添加数据console.log(param.get('file'))
          param.append('file', avatar)
          // 添加请求头
          this.$http.post('api/user/avatar', param, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
              let {code, msg} = response.data
              if (code === 0) {
                this.destroyAvatar()
                this.getUserInfo()
                this.$Message.info('头像设置成功')
              } else {
                this.$Message.info(msg)
              }
            })
        })
      }
    }
  }
</script>
