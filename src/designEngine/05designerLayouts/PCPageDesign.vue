<template>
  <div style="width:100%;height:100%">
    <div>我是设计器</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { EnginePageBase } from '../03designerLayoutBase'

@Component
export default class PCPageDesign extends EnginePageBase {
  public isDesigning: boolean = true
}
</script>
 
<style scoped>
</style>