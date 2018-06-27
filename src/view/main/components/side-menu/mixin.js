import CommonIcon from '@/components/common-icon'
export default {
  components: {
    CommonIcon
  },
  methods: {
    showTitle (item) {
      return item.title || (item.meta && item.meta.title) || item.name
    },
    showChildren (item) {
      return item.children && item.children.length > 1
    }
  }
}
