<template>
  <div id="app" oncontextmenu="self.event.returnValue=false;self.event.preventDefault()">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
@Component
export default class App extends Vue {
  mounted() {
    $(this.$el)[0].addEventListener('mousewheel', this._onMouseWheel, { passive: false })
  }
  /**禁用滚轮+ctrl 对浏览器进行缩放 */
  private _onMouseWheel(e: any) {
    var ctrlKey = e.ctrlKey || e.metaKey
    if (ctrlKey == true) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
</script>
<style>
@import '@/assets/css/main.css';
@import '@/assets/css/color-dark.css';
</style>
