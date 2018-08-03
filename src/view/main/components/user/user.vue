<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick" trigger="click" class="dev-header-dropdown-user" placement="bottom-end">
      <div>
        <Avatar :src="userAvator"/>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem name="info">
          <strong class="dev-header-aside-name">{{userName}}</strong>
          <div class="dev-header-aside-vip">
            <img src="https://file.iviewui.com/dev-dist/3eb78a60b677c55480495de82d69c8bc.png">
            <span>普通会员</span>
          </div>
        </DropdownItem>
        <DropdownItem divided name="ownspace">
          <Icon type="ios-settings-outline" size="16"></Icon>
          <span>设置</span>
        </DropdownItem>
        <DropdownItem name="logout">
          <Icon type="ios-log-out" size="16"></Icon>
          <span>退出登录</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import {mapActions} from 'vuex'

  export default {
    name: 'User',
    props: {
      userAvator: {
        type: String,
        default: ''
      },
      userName: {
        type: String,
        default: ''
      }
    },
    methods: {
      ...mapActions([
        'handleLogOut'
      ]),
      handleClick (name) {
        switch (name) {
          case 'logout':
            this.handleLogOut().then(() => {
              this.$router.push({name: 'login'})
            })
            break
          case 'ownspace':
            this.$router.push({name: 'ownspace'})
            break
        }
      }
    }
  }
</script>
