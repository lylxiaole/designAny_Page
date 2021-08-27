<template>
  <div class="app-wrapper" style="overflow:hidden">
    <app-main style="width:100%;height:100%;overflow:hidden" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'

@Component({
  name: 'chatLayout',
  components: {
    AppMain
  }
})
export default class chatLayout extends Vue {
  mounted() {}
  destroyed() {}
  activated() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

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
</style>
