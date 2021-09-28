<template>
  <div style="width:100%;height:100%">
    <div>我是设计器</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { EnginePageBase } from '../03designerLayoutBase'
import { truncate } from 'fs'

@Component
export default class PCPageDesign extends EnginePageBase {
  public get isDesigning(): boolean {
    return true
  }
  created() {
    window.console.log('PCPageDesign created')
  }
  mounted() {
    // this.canDrop = true
  }
}
</script>
 
<style scoped>
</style>