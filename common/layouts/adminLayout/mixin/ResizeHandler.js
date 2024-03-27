import { getStore } from '@common/baseConfigs'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design
// console.error('123123123')

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        getStore().dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      getStore().commit('system/toggleDevice', 'mobile')
      getStore().commit('system/closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        getStore().commit('system/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          getStore().commit('system/closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
