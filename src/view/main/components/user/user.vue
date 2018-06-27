<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick" trigger="click">
      <div>
        <Avatar :src="userAvator"/>
        <a style="font-weight: 600;">{{userName}}</a>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem name="ownspace">个人信息</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import { mapActions } from 'vuex'

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
              this.$router.push({
                name: 'login'
              })
            })
            break
          case 'ownspace':
            this.$router.push({
              name: 'ownspace'
            })
            break
        }
      }
    }
  }
</script>
