<template>
  <div :class="classObj" class="app-wrapper" style="overflow:hidden">
    <div class="main-container" style="height:100%;overflow:hidden;margin-left:0px">
      <div style="height:30pt;width:100%;overflow:hidden">
        <TopBar style="width:100%;height:100%;overflow:auto" />
      </div>
      <div style="height:calc(100% - 30pt);width:100%;overflow:hidden">
        <app-main style="width:100%;height:100%;overflow:hidden" />
      </div>
      <right-panel>
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@src/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView, TopBar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    TopBar
  },
  mixins: [ResizeMixin],
  mounted() {},
  computed: {
    ...mapState({
      sidebar: (state) => state.system.sidebar,
      device: (state) => state.system.device,
      showSettings: (state) => state.settings.showSettings
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@src/styles/mixin.scss';
@import '~@src/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>

