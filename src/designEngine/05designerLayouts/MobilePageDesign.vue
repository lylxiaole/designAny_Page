<template>
  <div style="width:100%;height:100%;position:relative">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { EnginePage, EngineLayout, EngineComponent } from '../03designerLayoutBase'
import { drawVueOnVirtualDom } from '@src/utils'
import DesignShell from './ComponentShells/DesignShell.vue'

@Component
export default class MobilePageDesign extends EnginePage {
  //页面中包含的布局容器
}
</script>
 
<style scoped>
</style>