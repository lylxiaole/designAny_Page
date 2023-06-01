<template>
  <div style="width:100%;height:100%;position:relative">
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import { EnginePage, EngineLayout, EngineComponent } from '../03designerLayoutBase'
 import DesignShell from './DesignShell.vue'

@Options({})
export default class MobilePageDesign extends EnginePage {
  //页面中包含的布局容器
}
</script>
 
<style scoped>
</style>