<template>
  <div class="side-menu-wrapper">
    <slot></slot>

    <transition name="slide-fade">
      <Menu ref="menu" v-show="!collapsed" :active-name="activeName" :open-names="openedNames" :accordion="accordion" :theme="theme" width="auto" @on-select="handleSelect">
        <template v-for="item in menuList">
          <template v-if="item.children && item.children.length === 1">
            <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
            <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
              <common-icon :type="item.children[0].icon || ''"/>
              <span>{{ showTitle(item.children[0]) }}</span></menu-item>
          </template>
          <template v-else>
            <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
            <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
              <common-icon :type="item.icon || ''"/>
              <span>{{ showTitle(item) }}</span></menu-item>
          </template>
        </template>
      </Menu>
    </transition>
    <transition name="slide-fade-out">
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu v-if="item.children && item.children.length > 1" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item"
                        :key="`drop-menu-${item.name}`"></collapsed-menu>
        <Tooltip transfer v-else :content="item.children.length === 1 ? item.children[0].title : item.title" placement="right" :key="`drop-menu-${item.name}`">
          <a @click="handleSelect(getNameOrHref(item))" class="drop-menu-a" :style="{textAlign: 'center'}">
            <common-icon :size="rootIconSize" :color="textColor" :type="item.children.length === 1 ? item.children[0].icon : item.icon"/>
          </a>
        </Tooltip>
      </template>
    </div>
    </transition>
  </div>
</template>
<script>
  import SideMenuItem from './side-menu-item.vue'
  import CollapsedMenu from './collapsed-menu.vue'
  import { getUnion } from '@/libs/tools'
  import mixin from './mixin'

  export default {
    name: 'SideMenu',
    mixins: [mixin],
    components: {
      SideMenuItem,
      CollapsedMenu
    },
    props: {
      menuList: {
        type: Array,
        default () {
          return []
        }
      },
      collapsed: {
        type: Boolean
      },
      theme: {
        type: String,
        default: 'dark'
      },
      rootIconSize: {
        type: Number,
        default: 20
      },
      iconSize: {
        type: Number,
        default: 16
      },
      accordion: Boolean,
      activeName: {
        type: String,
        default: ''
      },
      openNames: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        openedNames: []
      }
    },
    methods: {
      handleSelect (name) {
        this.$emit('on-select', name)
      },
      getOpenedNamesByActiveName (name) {
        return this.$route.matched.map(item => item.name).filter(item => item !== name)
      },
      updateOpenName (name) {
        if (name === 'home') this.openedNames = []
        else this.openedNames = this.getOpenedNamesByActiveName(name)
      }
    },
    computed: {
      textColor () {
        return this.theme === 'dark' ? '#fff' : '#495060'
      }
    },
    watch: {
      activeName (name) {
        if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
        else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
      },
      openNames (newNames) {
        this.openedNames = newNames
      },
      openedNames () {
        this.$nextTick(() => {
          this.$refs.menu.updateOpened()
        })
      }
    },
    mounted () {
      this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    }
  }
</script>
<style lang="less">
  @import './side-menu.less';
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  /* .slide-fade-leave-active {
     transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
   }*/
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(-10px);
    opacity: 0;
  }

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-out-enter-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-out-enter, .slide-out-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
